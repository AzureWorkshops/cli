Set-AzureRmVMCustomScriptExtension -ResourceGroupName 'azure-local-lab' -Location 'East US' -VMName 'dc1' -Name 'AddAccount' -FileUri 'https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/create-ad-users.ps1' -Confirm:$false -Run 'create-ad-users.ps1'

<#
PUT https://management.azure.com/subscriptions/71ef15cf-b2b4-4231-bd14-68299a851e28/resourceGroups/azure-local-lab/providers/Microsoft.Compute/virtualMachines/dc1/extensions/AddAccount?api-version=2016-04-30-preview HTTP/1.1
x-ms-client-request-id: 5f654f2d-bc8a-4055-a32b-c5b54be4a339
accept-language: en-US
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzUU4wQlpTN3M0bk4tQmRyamJGMFlfTGRNTSIsImtpZCI6ImEzUU4wQlpTN3M0bk4tQmRyamJGMFlfTGRNTSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDkyMTM5NzQ0LCJuYmYiOjE0OTIxMzk3NDQsImV4cCI6MTQ5MjE0MzY0NCwiX2NsYWltX25hbWVzIjp7Imdyb3VwcyI6InNyYzEifSwiX2NsYWltX3NvdXJjZXMiOnsic3JjMSI6eyJlbmRwb2ludCI6Imh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3VzZXJzLzg5NWY2Yjg1LTMzZjItNGU5NC1iMjA2LTYyMjQ5NGIwM2E0OC9nZXRNZW1iZXJPYmplY3RzIn19LCJhY3IiOiIxIiwiYWlvIjoiQVNRQTIvOERBQUFBaUIyN1lmbERXaEtkMTNHczR1TXZKNzFhWW93S093Mzl0VFNnNWEremNjTT0iLCJhbXIiOlsicnNhIiwid2lhIiwibWZhIl0sImFwcGlkIjoiMTk1MGEyNTgtMjI3Yi00ZTMxLWE5Y2YtNzE3NDk1OTQ1ZmMyIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiIwZjE2ZjVlMC01OTMwLTQzMmMtYWNjNy03NjRmMWY2MmUxN2YiLCJlX2V4cCI6MjYyODAwLCJmYW1pbHlfbmFtZSI6IkRhdmlzIiwiZ2l2ZW5fbmFtZSI6Ikpvc2h1YSIsImluX2NvcnAiOiJ0cnVlIiwiaXBhZGRyIjoiNTAuMjUxLjE1Mi4yMjEiLCJuYW1lIjoiSm9zaHVhIERhdmlzIiwib2lkIjoiODk1ZjZiODUtMzNmMi00ZTk0LWIyMDYtNjIyNDk0YjAzYTQ4Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEyNDUyNTA5NS03MDgyNTk2MzctMTU0MzExOTAyMS0xNjM3NDY4IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDNCRkZEOThBQjE1RUMiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJfR3ZHcHF5d240aFRjTUxJLUk5WTZodFRWZzVRYVZrNUVXTUZuM1ltSzlzIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJqb3NkYXZpc0BtaWNyb3NvZnQuY29tIiwidXBuIjoiam9zZGF2aXNAbWljcm9zb2Z0LmNvbSIsInZlciI6IjEuMCJ9.tscOdN0HAx4Gv6LDbhcEuEe9RHeL0Gnwl6JtItYHomJGf7jjosCQ4lbseepljcVePvLi_sHyRSd8gMmYLY3PlLO8aIuaMpemM4ROyPLswtq7v9NbUnqZlcdgO0j6m0Ij-XITMZ5PTRO3EH2qstBeampqWVGVEpzfN1Qpj4b4YGN6H5OQipuZyGJ3MbH21JSa8gAeayDeZShZsOmqoPnKo-gf8E9ZY3OdWfzTpdSygX83HBAE6mkM9Fei8BNTq1Mg2KvYe8Jj1kVuNELtAgHf5sm-TpcrWLmotAejKebiWWiLfR5obdhVbhbR8EW7UppenCakITVbmVu2RhkhPrUFDA
User-Agent: FxVersion/4.6.1637.0 OSName/Windows_10_Enterprise OSVersion/6.3.14393 Microsoft.Azure.Management.Compute.ComputeManagementClient/14.0.0-prerelease AzurePowershell/v3.6.0.0 PSVersion/v5.1.14393.1066
CommandName: Set-AzureRmVMCustomScriptExtension
ParameterSetName: SetCustomScriptExtensionByUriLinks
Content-Type: application/json; charset=utf-8
Host: management.azure.com
Content-Length: 458
Expect: 100-continue
Connection: Keep-Alive

{
  "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.4",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "fileUris": [
        "[https://raw.githubusercontent.com/AzureWorkshops/cli/master/scripts/create-ad-users.ps1]"
      ],
      "commandToExecute": "powershell -ExecutionPolicy Unrestricted -file create-ad-users.ps1 "
    }
  },
  "location": "East US"
}
#>