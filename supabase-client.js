// js/api/supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://opgeeqnucxrdqcgwcuge.supabase.co/rest/v1/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZ2VlcW51Y3hyZHFjZ3djdWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTgzODAsImV4cCI6MjA5NDU5NDM4MH0.yT10QOFErxHbTL8X-QOUQ8EydcJuLpStCbd8ucfTJr8';

export const supabase = createClient(supabaseUrl, supabaseKey);
