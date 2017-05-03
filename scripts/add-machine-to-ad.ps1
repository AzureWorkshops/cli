[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$Domain,

    [Parameter(Mandatory=$True)]
    [string]$DomainAdmin
)

$password = ConvertTo-SecureString "Pass@word1234" -AsPlainText -Force
$creds = New-Object System.Management.Automation.PSCredential($DomainAdmin, $password)
Add-Computer -DomainName $Domain -Credential $creds -Restart -Force -Confirm:$false