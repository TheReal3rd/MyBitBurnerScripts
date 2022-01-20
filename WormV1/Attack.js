/*
@Author 3rd
@Args Log(0,1) & Hostname
@Description
	-Automatically attack server to run hack-lite.script.
@Mem 4.45
*/

// Args Check
if (args.length == 0) {
	tprint("Required args not provided.")
	exit()
}

// Vars
var log = (args[0] === 1)

// Server Foreach
var serversList = []
if (args[1].includes(',')) serversList = args[1].split(',')
else serversList.push(args[1])

for (var i = 0; i != serversList.length; i++) {
	var target = serversList[i]
	logMessage(log, "Target: " + target)

	// Port Attacks START
	var aInc = 0;
	var pAttacks = 0;//Port Attacked
	var closing = false
	while (!closing) {
		switch (aInc) {
			case 0:
				if (fileExists("BruteSSH.exe", "home")) {
					logMessage(log, "Attacking With BruteSSH.")
					brutessh(target)
					pAttacks++;
				}
				aInc++;
				break
			case 1:
				if (fileExists("FTPCrack.exe", "home")) {
					logMessage(log, "Attacking With FTPCrack.")
					ftpcrack(target)
					pAttacks++;
				}
				aInc++;
				break
			case 2:
				if (fileExists("relaySMTP.exe", "home")) {
					logMessage(log, "Attacking With RelaySMTP.")
					relaysmtp(target)
					pAttacks++;
				}
				aInc++;
				break
			case 3:
				if (fileExists("HTTPWorm.exe", "home")) {
					logMessage(log, "Attacking With HTTPWorm.")
					httpworm(target)
					pAttacks++;
				}
				aInc++;
				break
			case 4:
				if (fileExists("SQLInject.exe", "home")) {
					logMessage(log, "Attacking With SQLInject.")
					sqlinject(target)
					pAttacks++;
				}
				aInc++;
				break
			case 5:
				logMessage(log, "Number of port attacks done: " + pAttacks)
				closing = true
				break
		}

		if (getHackingLevel() >= getServerRequiredHackingLevel(target) && pAttacks >= getServerNumPortsRequired(target)) {
			logMessage(log, "Attempting to gain root access...")
			nuke(target)
			logMessage(log, "Successfully gained root access!")
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
spawn("attack-worm.script", 1, args[0])

function logMessage(log, message) {
	if (log) tprint(message)
}
