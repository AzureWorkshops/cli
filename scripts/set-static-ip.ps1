[CmdletBinding()]
Param(
    [Parameter(Mandatory=$False)]
    [string]$IPs
)

# Get current IP configuration and set it to static IP
$ifconfig = (Get-NetIPConfiguration)[0];

$IP = $ifconfig.IPv4Address.IPAddress;
$MaskBits = 24; # This means subnet mask = 255.255.255.0
$Gateway = $ifconfig.IPv4DefaultGateway.NextHop;
$IPType = "IPv4";

$DNS = $ifconfig.DNSServer.ServerAddresses;
$IParr = $IPs.Split(',');
for($i=$IParr.Length - 1; $i -ge 0; $i--) {
    $DNS = ,$IParr[$i] + $DNS;
}

# Retrieve the network adapter that you want to configure
$adapter = Get-NetAdapter | ? {$_.Status -eq "up"}

# Remove any existing IP, gateway from our ipv4 adapter
If (($adapter | Get-NetIPConfiguration).IPv4Address.IPAddress) {
    $adapter | Remove-NetIPAddress -AddressFamily $IPType -Confirm:$false
}
If (($adapter | Get-NetIPConfiguration).Ipv4DefaultGateway) {
    $adapter | Remove-NetRoute -AddressFamily $IPType -Confirm:$false
}

# Configure the IP address and default gateway
$adapter | New-NetIPAddress `
 -AddressFamily $IPType `
 -IPAddress $IP `
 -PrefixLength $MaskBits `
 -DefaultGateway $Gateway

# Configure the DNS client server IP addresses
$adapter | Set-DnsClientServerAddress -ServerAddresses $DNS