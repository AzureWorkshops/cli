[CmdletBinding()]
Param(
    [Parameter(Mandatory=$True)]
    [string]$Domain
)

$jim = 'jim.smith@' + $Domain;
$sally = 'sally.holly@' + $Domain;
$richard = 'richard.jackson@' + $Domain;

$password = ConvertTo-SecureString -String 'Pass@word1234' -AsPlainText -Force
New-ADUser -Name 'Jim Smith' -GivenName 'Jim' -Surname 'Smith' -SamAccountName 'jim.smith' -UserPrincipalName $jim -AccountPassword $password -PassThru | Enable-ADAccount
New-ADUser -Name 'Sally Holly' -GivenName 'Sally' -Surname 'Holly' -SamAccountName 'sally.holly' -UserPrincipalName $sally -AccountPassword $password -PassThru | Enable-ADAccount
New-ADUser -Name 'Richard Jackson' -GivenName 'Richard' -Surname 'Jackson' -SamAccountName 'richard.jackson' -UserPrincipalName $richard -AccountPassword $password -PassThru | Enable-ADAccount