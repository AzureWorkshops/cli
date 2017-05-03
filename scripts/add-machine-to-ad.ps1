[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$Domain,

    [Parameter(Mandatory=$True)]
    [string]$DomainAdmin,

    [Parameter(Mandatory=$True)]
    [string]$DomainAdminPassword
)

$password = ConvertTo-SecureString $DomainAdminPassword -AsPlainText -Force
$creds = New-Object System.Management.Automation.PSCredential($DomainAdmin, $password)
Add-Computer -DomainName $Domain -Credential $creds -Restart -Force -Confirm:$false