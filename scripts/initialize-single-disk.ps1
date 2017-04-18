Stop-Service -Name ShellHWDetection
$disk = Get-Disk | Where partitionstyle -EQ 'raw';
$disk | Initialize-Disk -PartitionStyle GPT -PassThru | New-Partition -DriveLetter 'F' -UseMaximumSize | Format-Volume -FileSystem NTFS -NewFileSystemLabel 'Data' -Confirm:$false
Start-Service -Name ShellHWDetection