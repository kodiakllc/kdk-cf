import axios from 'axios';
import * as dotenv from 'dotenv';
import { Zone } from '../types/Zone';
import { DnsRecord } from '../types/DnsRecord';
import { PageRule } from '../types/PageRule';
import { RedirectRule } from '../types/RedirectRule';

dotenv.config();

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL;

if (!CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL) {
  console.error("Cloudflare API credentials are missing. Please check your .env file.");
  process.exit(1);
}

const CLOUDFLARE_API_BASE_URL = 'https://api.cloudflare.com/client/v4';

const axiosInstance = axios.create({
  baseURL: CLOUDFLARE_API_BASE_URL,
  headers: {
    'X-Auth-Email': CLOUDFLARE_EMAIL,
    'X-Auth-Key': CLOUDFLARE_API_KEY,
    'Content-Type': 'application/json'
  }
});

export async function listZones(): Promise<Zone[]> {
  try {
    const response = await axiosInstance.get('/zones');
    return response.data.result;
  } catch (error) {
    console.error("Error fetching zones:", error);
    throw error;
  }
}

export async function listDnsRecords(zoneId: string): Promise<DnsRecord[]> {
  try {
    const response = await axiosInstance.get(`/zones/${zoneId}/dns_records`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching DNS records for zone ${zoneId}:`, error);
    throw error;
  }
}

export async function listPageRules(zoneId: string): Promise<PageRule[]> {
  try {
    const response = await axiosInstance.get(`/zones/${zoneId}/pagerules`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching page rules for zone ${zoneId}`);
    throw error;
  }
}

export async function listRedirectRules(zoneId: string): Promise<RedirectRule[]> {
  try {
    const response = await axiosInstance.get(`/zones/${zoneId}/rulesets/phases/http_request_dynamic_redirect/entrypoint`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching redirect rules for zone ${zoneId}`);
    throw error;
  }
}

export async function updateRedirectRule(zoneId: string, ruleId: string, updatedRule: RedirectRule): Promise<void> {
  try {
    await axiosInstance.put(`/zones/${zoneId}/rulesets/${ruleId}`, updatedRule);
    console.log(`Updated rule ${ruleId} successfully.`);
  } catch (error) {
    console.error(`Error updating rule ${ruleId} for zone ${zoneId}:`, error);
    throw error;
  }
}