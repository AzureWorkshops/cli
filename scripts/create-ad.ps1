# Add Active Directory, DNS and respective management tools (including powershell)
Add-WindowsFeature -Name AD-Domain-Services, RSAT-AD-PowerShell, DNS, RSAT-DNS-Server

# Enable (and configure) the AD Forest
$password = ConvertTo-SecureString -String 'Pass@word!' -AsPlainText -Force
Install-ADDSForest -DomainName 'azurelab.cloud' -ForestMode Default -DomainMode Default -InstallDns -SafeModeAdministratorPassword $password -Confirm:$false -DatabasePath 'F:\NTDS' -LogPath 'F:\NTDS' -SysvolPath 'F:\SYSVOL'