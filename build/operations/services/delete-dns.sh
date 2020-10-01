# DELETE CNAME record
for name in ${names[@]}; do
    
    # Compose names
    dns_cname=$name.$dns_zone
    web_app_name=$name-$location_abbr-app
    
    echo "deleting cnames for [$name] ..."
    az network dns record-set cname remove-record --resource-group "fast-ops-rg" --zone-name $dns_zone --record-set-name $name --cname $dns_cname

done
