import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 10; // Free tier daily limit

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { action } = await req.json();

    if (action === 'check') {
      // Get current usage
      const { data: usage, error } = await supabaseClient
        .from('ai_daily_usage')
        .select('prompts_used')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .single();

      const currentUsage = usage?.prompts_used || 0;
      const remaining = Math.max(0, DAILY_LIMIT - currentUsage);

      return new Response(JSON.stringify({ 
        used: currentUsage, 
        remaining,
        limit: DAILY_LIMIT,
        canUse: remaining > 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'increment') {
      // Check current usage first
      const { data: usage } = await supabaseClient
        .from('ai_daily_usage')
        .select('prompts_used')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .single();

      const currentUsage = usage?.prompts_used || 0;
      
      if (currentUsage >= DAILY_LIMIT) {
        return new Response(JSON.stringify({ 
          error: 'Daily limit exceeded',
          used: currentUsage,
          remaining: 0,
          limit: DAILY_LIMIT
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Increment usage (upsert)
      const { data, error } = await supabaseClient
        .from('ai_daily_usage')
        .upsert({
          user_id: user.id,
          usage_date: today,
          prompts_used: currentUsage + 1
        }, {
          onConflict: 'user_id,usage_date'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating usage:', error);
        return new Response(JSON.stringify({ error: 'Failed to update usage' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const newUsage = data.prompts_used;
      const remaining = Math.max(0, DAILY_LIMIT - newUsage);

      return new Response(JSON.stringify({ 
        used: newUsage, 
        remaining,
        limit: DAILY_LIMIT,
        canUse: remaining > 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in check-ai-quota function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});