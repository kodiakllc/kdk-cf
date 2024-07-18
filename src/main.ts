import { listZones, listDnsRecords, listPageRules, listRedirectRules, updateRedirectRule } from './services/cloudflare-service';
import { Zone } from './types/Zone';
import { DnsRecord } from './types/DnsRecord';
import { PageRule } from './types/PageRule';
import { RedirectRule } from './types/RedirectRule';

async function main() {
    listZones()
        .then((zones: Zone[]) => {
            if (zones.length === 0) {
                console.log("No zones found in your Cloudflare account.");
                return;
            }

            zones.forEach(zone => {
                console.log(`\nZone: ${zone.name}`);

                // Fetch DNS records
                listDnsRecords(zone.id)
                    .then((dnsRecords: DnsRecord[]) => {
                        dnsRecords.forEach(record => {
                            console.log(`- ${record.type} ${record.name}: ${record.content}`);
                        });
                    })
                    .catch(error => {
                        console.error(`Error fetching DNS records for zone ${zone.id}:`, error);
                    });

                // Fetch page rules
                listPageRules(zone.id)
                    .then((pageRules: PageRule[]) => {
                        console.log(`Page Rules: ${JSON.stringify(pageRules, null, 2)}`);
                    })
                    .catch(error => {
                        console.error("Error fetching page rules");
                    });

                // Fetch redirect rules
                listRedirectRules(zone.id)
                    .then((redirectRules: RedirectRule[]) => {
                        console.log(`Redirect Rules: ${JSON.stringify(redirectRules, null, 2)}`);

                        redirectRules.forEach(rule => {
                            console.log(`- Rule ID: ${rule.id}`);
                            console.log(`  Description: ${rule.description}`);
                            console.log(`  Action: ${rule.rules[0].action}`);
                            console.log(`  Target URL: ${rule.rules[0].action_parameters.from_value.target_url.expression}`);

                            // Update the target URL
                            rule.rules[0].action_parameters.from_value.target_url.expression = 'https://rh.com/';

                            // Send the update request
                            updateRedirectRule(zone.id, rule.id, rule)
                                .then(() => {
                                    console.log(`Updated rule ${rule.id} successfully.`);
                                })
                                .catch(error => {
                                    console.error(`Error updating rule ${rule.id} for zone ${zone.id}:`, error);
                                });
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching redirect rules");
                    });
            });
        })
        .catch(error => {
            console.error("An error occurred:", error);
        });
}

main();
