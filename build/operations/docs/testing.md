# Testing Procedures for Azure Web Apps
## This test validates that backend is not accessible except by Azure Front Door
At each step below refresh web page. This procedure should be use for each subdomain. A checkmark indicates Pass.

1. [ ] https://www.fast.design
2. [ ] https://app.fast.design
3. [ ] https://color.fast.design
4. [ ] https://explore.fast.design
5. [ ] https://create.fast.design
6. [ ] @herehttps://motion.fast.design

#### Validate all regions are turned off.  
	1. Turn off East Region,
	2. Turn off West Region
	3. Refresh
Expected result: 403, Web app is stopped

### Validate passive region 
	1. Turn on East Region
	2. Turn off West Region
	3. Refresh
Expected result: 200, Web app loads

### Validate passive region with direct access failing
	1. Turn on East Region
	2. Turn off West Region
	3. Configure East Networking Access Restrictions
		1. Set the following for IPv4
			§ Name: Front Door IPv4
			§ Priority:  100
			§ Action: Allow
			§ Description:  Deny access to all except Front Door
			§ IPv4 Address Block - 147.243.0.0/16
		2. Set the following for IPv6
			§ Name: Front Door IPv6
			§ Priority:  200
			§ Action: Allow
			§ Description:  Deny access to all except Front Door
			§ IPv6 Address Block - 2a01:111:2050::/44
	4. Refresh
Expected: 403, Forbidden "blocked your access"

### Validate active and passive Region turned off
	1. Turn off East Region
	2. Turn off West Region
	3. Refresh
Expected: Service Unavailable

### Validate active region
	1. Turn on West Region
	2. Turn off East Region
	3. Refresh
Expected: 200, Web app loads

### Validate active region with direct access failing
	1. Turn off East Region
	2. Turn on West Region
	3. Configure West Networking Access Restrictions
		1. Set the following for IPv4
			§ Name: Front Door IPv4
			§ Priority:  100
			§ Action: Allow
			§ Description:  Deny access to all except Front Door
			§ IPv4 Address Block: 147.243.0.0/16
		2. Set the following for IPv6
			§ Name: Front Door IPv6
			§ Priority:  200
			§ Action: Allow
			§ Description:  Deny access to all except Front Door
			§ IPv6 Address Block: 2a01:111:2050::/44
	4. Refresh
Expected: 403, Forbidden "blocked your access"

### Resources
https://stackoverflow.com/questions/62461510/how-to-configure-web-apps-such-that-they-cannot-be-accessed-directly
