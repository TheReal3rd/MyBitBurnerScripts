/*
@Author 3rd
@Args Log(0,1) & Hostname
@Description
	-Automatically attack server to run hack-lite.script.
@Mem 2.45
*/

//Args Check
if (args.length == 0) {
	tprint("Required args not provided.")
	exit()
}

//Vars
var log = (args[0] === 1)
var ftpC = fileExists("FTPCrack.exe")
var bSSH = fileExists("BruteSSH.exe")
var rSMTP = fileExists("relaySMTP.exe")
var wHTTP = fileExists("HTTPWorm.exe")
var iSQL = fileExists("SQLInject.exe")

// Server Foreach
for (var i = 1; i != args.length; i++) {
	var target = args[i]
	// Port Attacks START
	var aInc = 0;
	var closing = false
	while (!closing) {
		if (getServerNumPortsRequired(target) > aInc) {
			switch (aInc) {
				case 0:
					if (bSSH) {
						logMessage(log, "Attacking With BruteSSH.")
						brutessh(target)
					}
					aInc++;
					break
				case 1:
					if (ftpC) {
						logMessage(log, "Attacking With FTPCrack.")
						ftpcrack(target)
					}
					aInc++;
					break
				case 2:
					if (rSMTP) {
						logMessage(log, "Attacking With RelaySMTP.")
						relaysmtp(target)
					}
					aInc++;
					break
				case 3:
					if (wHTTP) {
						logMessage(log, "Attacking With HTTPWorm.")
						httpworm(target)
					}
					aInc++;
					break
				case 4:
					if (iSQL) {
						logMessage(log, "Attacking With SQLInject.")
						sqlinject(target)
					}
					aInc++;
					break
				case 5:
					logMessage(log, "Ran out of attacks.")
					closing = true
					break
			}
		} else {
			//TEMP FIX
			if (getHackingLevel() >= getServerRequiredHackingLevel(target)) {
				logMessage(log, "Attempting to gain Root Access...")
				nuke(target)
				logMessage(log, hasRootAccess(target) ? "Successfully gained root access!" : "Failed to gain root access!")
			}
			closing = true
		}
	}
	// Port Attacks END
	// Hack Level Attack START
	if (hasRootAccess(target)) {
		while (getHackingLevel() < getServerRequiredHackingLevel(target)) {
			logMessage(log, target + " Level too high weakning...")
			weaken(target)
		}
	}
	// Hack Level Attack END
}

function logMessage(log, message) {
	if (log) tprint(message)
}
