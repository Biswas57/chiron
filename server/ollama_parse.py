#!/usr/bin/env python3

import subprocess

def generate_prompt(content):
    """
    Build the text prompt you want to send to Ollama.
    """
    prompt = """
### INSTRUCTION: 
The following text is a Knowledge Base article for a Nutanix product. This article is to be converted to a video to assist users of the product run the steps outlined in the article themselves. Your task is to generate a script for this video, based on the article contents. 

Where multiple options or scenarios are presented in the article, choose the most common path to be presented in the video.

Your script will be converted to speech using TTS, and someone will manually generate the visuals based on your script, you should account for this in the pacing of the script. For pauses, add “...” on a new line, however, do not include any additional annotation or direction (i.e. do NOT include annotations such as [Intro music plays]), just the script. Do not include any preamble, only generate the script that is to be fed directly to an AI TTS (i.e. do NOT include something like “here is your script”).

### KB ARTICLE CONTENT:
"""
    return prompt + "\n\n" + content

def write_script(prompt):
    """
    Pass the prompt to Ollama via subprocess.
    Capture the model's response from stdout.
    """
    # Command and model name you'd like to run
    model_cmd = ["ollama", "run", "llama3.1:8b"]

    # Run the command, sending `prompt` to its stdin
    # `capture_output=True` captures the response
    result = subprocess.run(
        model_cmd,
        input=prompt,
        capture_output=True,
        text=True
    )

    # Ollama’s output comes from stdout
    return result.stdout

def generate_script(content):
    """
    High-level function that builds the prompt,
    calls Ollama, and returns the AI’s completion.
    """
    prompt = generate_prompt(content)
    completion_text = write_script(prompt)
    return completion_text

# Example usage:
if __name__ == "__main__":
    kb_content = """
    Description:
AOS Only - What to do when /home partition or /home/nutanix directory on a Controller VM (CVM) is full
KB article page
Article #
KB-1540
Last modified on
Jan 22nd 2025
Summary:
This article describes ways to safely free up space if /home partition or /home/nutanix directories of a CVM become full or do not contain sufficient free space to facilitate an AOS upgrade.

Troubleshooting
Infrastructure
Upgrade
AOS
Nutanix Cloud Clusters (NC2) - AWS
Nutanix Cloud Clusters (NC2) - Azure
Description:
Important Notes:

Do not use this KB or the cleanup script if /home partition is exceeding the limit on a Prism Central VM (PCVM). For the PCVM issue, refer to KB 5228.
Login to the CVMs as nutanix user
Do not treat the Nutanix CVM (Controller VM) as a normal Linux machine.
Do not use rm -rf under any circumstances unless stated. It will lead to data loss scenarios.
If you are running LCM-2.6 or LCM-2.6.0.1, LCM log collection fills up /home directory please refer KB 14671 for workaround.
If you receive /home partition usage high alert on a cluster running NCC 4.0.0, also check KB 10530.
You can review the specific clusters affected by this alert via the discoveries on the Support Portal powered by Nutanix Insights here
Contact Nutanix Support if you have any doubts.
CVM /home partition or /home/nutanix directory being full can be reported in two scenarios:

The NCC health check disk_usage_check reports that the /home partition usage is above the threshold (by default, 75%).
The pre-upgrade check test_nutanix_partition_space checks if all nodes have a minimum of 5.6 GB space in the /home/nutanix directory.
The following error messages are generated in Prism by the test_nutanix_partition_space pre-upgrade check:

Not enough space on /home/nutanix directory on Controller VM [ip]. Available = x GB : Expected = x GB

Failed to calculate minimum space required

Failed to get disk usage for cvm [ip], most likely because of failure to ssh into cvm

Unexpected output from df on Controller VM [ip]. Please refer to preupgrade.out for further information

Nutanix reserves space on the SSD tier of each CVM for its files and directories. These files and directories are in the /home folder you see when you log in to a CVM. The size of the /home folder is capped at 40 GB so that most of the space on SSD is available for user data.

Due to the limited size of the /home partition, running low on free space and triggering Prism Alerts, NCC Health Check failures or warnings, or Pre-Upgrade Check failures is possible. These guardrails exist to prevent /home from becoming full, as this causes data processing services like Stargate to become unresponsive. Clusters where multiple CVMs' /home partitions are 100% full often result in downtime of user VMs.

When cleaning up unused binaries and old logs on a CVM, it is important to note that all the user data partitions on each drive associated with a given node are also mounted within /home. Nutanix advises strongly against using undocumented commands like rm -rf /home since this will also wipe the user data directories mounted within this path. This article aims to guide you through identifying the files causing the CVM to have low free space and removing only those that can be deleted safely.
 


Solution:
Note: The latest versions of AOS include enhancements and bug fixes designed to optimize /home space utilization. To avoid potential issues down the line, it's crucial to ensure your AOS is regularly updated.

General Guidance

Checking the space usage in /home.
To accommodate a potential AOS upgrade, usage should be below 70%. Use the df -h command to verify the amount of free space in /home. In the example below, CVM x.x.x.12 /home usage is 81%.

nutanix@cvm$ allssh "df -h /home"
================== x.x.x.11 =================
/dev/md2         40G   22G   18G  55% /home
================== x.x.x.12 =================
/dev/md2         40G   32G  7.4G  81% /home
================== x.x.x.13 =================
/dev/md2         40G   24G   16G  61% /home


To obtain a further breakdown of usage in descending order, гse the du -h command with -d flag to obtain a no of dir level you required. For example, below -d 2 implies looking in two directory levels from /home/nutanix/data , additionally, adding head -n 15 will display the top 15 directories that can be then compared with other CVMs to see where the high usage is coming from:

nutanix@CVM:~$ allssh "du -h -d 2 -x /home/nutanix/data |sort -h -r |head -n 15"
================== xx.xx.xx.11 =================
17G    /home/nutanix/data
9.4G    /home/nutanix/data/logs
4.6G    /home/nutanix/data/installer/el7.*
4.6G    /home/nutanix/data/installer
11G    /home/nutanix/data/logs/sysstats
512M    /home/nutanix/data/ncc/installer
================== xx.xx.xx.12 =================
18G    /home/nutanix/data
9.5G    /home/nutanix/data/logs
4.6G    /home/nutanix/data/installer/el7.*
4.6G    /home/nutanix/data/installer
3.0G    /home/nutanix/data/logs/sysstats
610M    /home/nutanix/data/logbay/taskdata
.
.

CVM /home partition information can be collected using the logbay command (NCC 4.0.0 and above, KB 6691).

nutanix@cvm$ logbay collect -t disk_usage_info

Cleaning unnecessary files under /home directory.
If you have any open cases with pending Root Cause Analysis, check with the case owner whether these log files are still required or can be discarded.

Warnings: Ensure to keep the important notes mentioned at the top of the Knowledge Base (KB) article handy before applying any workarounds

Method 1. Using approved script
Download and run KB-1540_clean_v12a.sh to clean files from approved directories. Note: This script is NOT qualified to be used on Prism Central VM.

From any CVM, run the following commands to download KB-1540_clean_v12a.sh: (MD5:e172350fff1633db1c2e7104e6200e34)
nutanix@cvm:~$ cd ~/tmp
nutanix@cvm:~/tmp$ wget -O KB-1540_clean_v12a.sh http://download.nutanix.com/kbattachments/1540/KB-1540_clean_v12a.sh
nutanix@cvm:~/tmp$ md5sum KB-1540_clean_v12a.sh
e172350fff1633db1c2e7104e6200e34  KB-1540_clean_v12a.sh

Deploy the script to a local CVM or all CVMs of the cluster:
nutanix@cvm:~/tmp$ sh KB-1540_clean_v12a.sh

Select package to deploy
     1 : Deploy the tool only to the local CVM
     2 : Deploy the tool to all of the CVMs in the cluster
    Selection (Cancel="c"):           <==== 1 or 2

Execute the script to clear files from approved directories.
Help
nutanix@cvm:~/tmp$ ./nutanix_home_clean.py --help   [--no_color]

Interactive mode
nutanix@cvm:~/tmp$ ./nutanix_home_clean.py   [--no_color]

Non-interactive mode
nutanix@cvm:~/tmp$ ./nutanix_home_clean.py <command> <option>   [--no_color]


Note: If the output of the script or its coloring looks incorrect, try to set the environment variable before running the script or use "--no_color" option:
nutanix@cvm:~/tmp$ TERM=xterm


Interactive mode
User-added image
Main menu
All Plans	Switch displaying plans (all / concerned)
Rescan	Rescan usages and update table
List All	List all targetted files/directories
Run All	Run or Dry-run all plans
Export All	Export all targetted files/directories to CSV
##: Plan #	Go to the plan item menu
Plan item menu
Rescan	Rescan and update table
Operation	Change operation (remove/shelter/etc.)
List	List targetted files/directories
Dryrun	Dry-run this plan
Run	Run this plan
Export	Export targetted files/directories to CSV
Non-interactive mode
User-added image
Commands
$ ./nutanix_home_clean.py --scan	Scan and show the usages.
$ ./nutanix_home_clean.py --list
$ ./nutanix_home_clean.py --list=<##>	List up the target files for all plans or specific plan-##.
$ ./nutanix_home_clean.py --dryrun
$ ./nutanix_home_clean.py --dryrun=<##>	Dry-run all plans or specific plan-##.
$ ./nutanix_home_clean.py --run
$ ./nutanix_home_clean.py --run=<##>	Run all plans or specific plan-##.
Additional Options
--operation=<op>	Choose operation (remove, shelter)
--sheletedir=<path>	Set the sheltering location.
--yes	For skipping disclaimer and confirmation.
If an item is listed as "instruction" under the Operation column, you can view the instructions by running that item.

For example:

┌─────────────────────────────────────────────────────────┬───────────┬────────┐
│ Cleaning plans: Concerned items                         │ Operation │ Usage  │
├─────────────────────────────────────────────────────────┼───────────┼────────┤
│ 5: Log bundle (logbay)                                  │remove     │   2.25G│
│10: Downloaded installer                                 │instruction│ 824.00M│
│59: Possible manually created files                      │instruction│   3.69G│
├─────────────────────────────────────────────────────────┴───────────┼────────┤
│                                                               Total │   6.74G│
╞═════════════════════════════════════════════════════════════════════╧════════╡
│CVM x.x.x.x                                                                   │
│ /home usage = 30.99G (80%)   >> cleaning is recommended                      │
└──────────────────────────────────────────────────────────────────────────────┘

Items 10 and 59 are listed as "instruction". To see the instructions for item 10, run it by entering "10" on the Main menu and entering "R" on the next screen. Sample output below:

┌─────────────────────────────────────────────────────────┬───────────┬────────┐
│ Cleaning plan 10                                        │ Operation │ Usage  │
├─────────────────────────────────────────────────────────┼───────────┼────────┤
│10: Downloaded installer                                 │instruction│ 824.00M│
└─────────────────────────────────────────────────────────┴───────────┴────────┘
Plan 10 menu
 ( Quit, Back, Help, Rescan, Operation, List, Dryrun, Run, Export): R
                                                                                
Run operation for plan 10: "instruction"
 Manual operation is required for plan 10
  -- Instruction --
  These downloaded installers can be deleted from "Upgrade Software" on Prism.
  Please find a section with "/home/nutanix/software_downloads/" on
  KB-1540 (http://portal.nutanix.com/kb/1540)
  Older installer files could not be listed on Prism or by ncli.
  Please contact Nutanix Support whenever you need assistance.
 
┌─────────────────────────────────────────────────────────┬───────────┬────────┐
│ Cleaning plan 10                                        │ Operation │ Usage  │
├─────────────────────────────────────────────────────────┼───────────┼────────┤
│10: Downloaded installer                                 │instruction│ 824.00M│
└─────────────────────────────────────────────────────────┴───────────┴────────┘

Repeat the above for item 59 to see the instructions for item 59.

 
Cleaning up after the troubleshooting
The downloaded script files, logs and exported files are expected to be removed manually after every troubleshooting. The total size of these files should be small and will not affect CVM's filesystem. You can remove the following files once the script becomes unnecessary.
<yymmdd-hhmmss> is the creation date and time.
In the CVM where the KB script is deployed (/home/nutanix/tmp/):
KB-1540_clean.sh - downloaded file from the KB
deploytool_yyyymmdd-hhmmss.log - deployment script's log (unnecessary after deployment)
nutanix_home_clean.py - main KB script
nutanix_home_clean_config.py - config file for the main script
In the rest of the CVMs in the cluster - if deployed to all CVM in step 2:
nutanix_home_clean.py - main KB script
nutanix_home_clean_config.py - config file for the main script
Every CVM where nutanix_home_clean.py is run:
KB-1540_v12_yyyymmdd_hhmmss_nutanix_home_clean.log - KB script's log
KB-1540_v12_yyyymmdd_hhmmss_export_*.csv - exported files (if exported)
The following command can remove all of the above:
nutanix@cvm:~/tmp$ allssh 'cd ~/tmp/; /usr/bin/rm KB-1540* deploytool_*.log nutanix_home_clean.py nutanix_home_clean_config.py'


Method 2 Manual method

PLEASE READ: Only the files under the directories stated below are safe to delete. Take note of the specific guidance for removing files from each directory. Do not use any other commands or scripts to remove files. Do not use rm -rf under any circumstances.

Removing old logs and core files. Only delete the files inside the following directories and not the directories themselves.
/home/nutanix/data/cores/
/home/nutanix/data/binary_logs/
/home/nutanix/data/ncc/installer/
/home/nutanix/data/log_collector/
/home/nutanix/prism/webapps/console/downloads/NCC-logs-*
Use the following syntax for deleting files within each of these directories:

nutanix@cvm:~$ /usr/bin/rm /home/nutanix/data/cores/*

Removing old ISOs and software binaries. Only delete the files inside the following directories and not the directories themselves.
Check the current running AOS version under "Cluster Version":

nutanix@cvm:~$ ncli cluster info | egrep 'Cluster [Name|Version]'
Cluster Name : Axxxxa 
Cluster Version : 5.10.2

/home/nutanix/software_uncompressed/ - The software_uncompressed folder is only in use when the pre-upgrade is running and should be removed after a successful upgrade. If you see a running cluster that is currently not upgrading, it is safe to remove everything within the software_uncompressed directory. Delete any old versions other than the version to which you are upgrading.
/home/nutanix/foundation/isos/ - Old ISOs of hypervisors or Phoenix.
/home/nutanix/foundation/tmp/ - Temporary files that can be deleted.
Use the following syntax for deleting files within each of these directories:

nutanix@cvm:~$ /usr/bin/rm /home/nutanix/foundation/isos/*
nutanix@cvm:~$ /usr/bin/rm /home/nutanix/foundation/tmp/*

/home/nutanix/software_downloads/
If the files under the software_downloads directory are not required for any planned upgrades, remove them from Prism Web Console > Settings> Upgrade Software. Also check File Server, Hypervisor, NCC, and Foundation tabs to locate the downloads you may not require. The example below illustrates two versions of AOS available for upgrade, each consumes around 5 GB. Click on the 'X' to delete the files.

Upgrade Software page showing the Download option

If it is checked, uncheck the “Enable Automatic Download” option. Left unmonitored, the cluster will download multiple versions, consuming space in the home directory unnecessarily.

Re-check space usage in /home using df -h (see General Guidance of this article) to confirm that it is now below 70%.

Note: If you cannot delete the files with the below error and space not claimed, contact Nutanix Support for assistance.

nutanix@CVM:~$ sudo /usr/bin/rm -f /home/nutanix/software_uncompressed/xxx    
==> System files detected:
/home/nutanix/software_uncompressed/xxx
Operation not allowed. Deletion of system files will cause  cluster instability and potential data loss.


Important Notes for NC2 Clusters:
It has been observed in some instances of NC2 clusters that /tmp gets close to full. You can follow the below steps to clean ~/tmp directory.

SSH to the affected CVM and check the disk usage by running "df -h" command:
nutanix@CVM:~$ df -h /tmp
Filesystem      Size  Used Avail Use% Mounted on
/dev/loop0      240M  236M     0 100% /tmp

In the above output, we can see /tmp is showing 100%. Change the directory to ~/tmp and sort the list using sudo du -aSxh /tmp/* | sort -h.
4.0K    /tmp/hsperfdata_nutanix
12K     /tmp/lost+found
23K     /tmp/rc_nutanix_start.1731.log
39K     /tmp/rc_nutanix_start.1734.log
78M     /tmp/infra-gateway.ntnx-i-02a754840c30b5e66-a-cvm.root.log.ERROR.20230123-201357.3575
78M     /tmp/infra-gateway.ntnx-i-02a754840c30b5e66-a-cvm.root.log.INFO.20230123-200932.3575
78M     /tmp/infra-gateway.ntnx-i-02a754840c30b5e66-a-cvm.root.log.WARNING.20230123-201357.3575

From the output you receive above, manually delete files larger than 12K. For example, see below files deleted from the above output.
nutanix@CVM:~/tmp$ sudo /usr/bin/rm /tmp/infra-gateway.ntnx-i-02a754840c30b5e66-a-cvm.root.log.WARNING.20230123-201357.3575
nutanix@CVM:~/tmp$ sudo /usr/bin/rm /tmp/infra-gateway.ntnx-i-02a754840c30b5e66-a-cvm.root.log.INFO.20230123-200932.3575
nutanix@CVM:~/tmp$ sudo /usr/bin/rm /tmp/.ntnx-i-02a754840c30b5e66-a-cvm.root.log.ERROR.20230123-201357.3575
nutanix@CVM:~/tmp$ sudo /usr/bin/rm /tmp/rc_nutanix_start.1734.log
nutanix@CVM:~/tmp$ sudo /usr/bin/rm /tmp/rc_nutanix_start.1731.log

After deleting, you can check available free space using df -h:
nutanix@CVM:~/tmp$ df -h /tmp
Filesystem      Size  Used Avail Use% Mounted on
/dev/loop0      240M   14M  210M   6% /tmp

As you can see, available free space now shows 6%. You can further recheck with:
nutanix@CVM:~$ ncc health_checks hardware_checks disk_checks disk_usage_check --cvm_list=<cvm IP>

or
nutanix@CVM:~$ ncc health_checks run_all

Contact Nutanix Support for assistance if /home usage is still above the threshold after cleaning up files from the approved directories. Under no circumstances should you remove files from any other directories aside from those recommended by this article, as these may be critical to the CVM performance or may contain user data.
"""  
    script_result = generate_script(kb_content)
    print(script_result)
