$password = ConvertTo-SecureString "Pass@word1234" -AsPlainText -Force
$creds = New-Object System.Management.Automation.PSCredential("azurelab\cloudadmin", $password)
Add-Computer -DomainName "azurelab.cloud" -Credential $creds -Restart -Force -Confirm:$false