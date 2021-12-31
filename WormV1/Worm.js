/*
@Author 3rd
@Args log(0,1)
@Libs None
@Description
	-Automatically scan for server to then attack or hack finally transfering itself to the target systems.
@Mem 5.00
@TODO
	-Make the Script more efficent.
	-Fix Script Rerunning.
	-Implement whitelist system.
	-Implement a command and control system to allow stoping the worm.
*/

// Args Check
if (args.length == 0) {
	tprint("Required args not provided.")
	exit()
}

// Vars
var log = (args[0] === 1)
var tServers = scan()
var hServers = []
var aServers = []
var wormMem = 5.00
var attackMem = 2.45
var hMem = 1.70

// Worm START
for (var i = 0; i != tServers.length; i++) {
	var target = tServers[i]
	if (target === "home" || target === "darkweb") continue
	if (hasRootAccess(target) && getHackingLevel() >= getServerRequiredHackingLevel(target)) {
		hServers.push(target)
	} else {
		aServers.push(target)
	}
}

if (aServers.length != 0) {
	doAttack(log, aServers)
}
if (hServers.length != 0) {
	doHack(log, hServers)
	doWorm(log, hServers)
}
// Worm END

// Methods START
// Actions
function doWorm(log, servers) {
	for (var i = 0; i != servers.length; i++) {
		var target = servers[i]
		if (target === "home") continue
		logMessage(log, "Spreading to " + target)
		scp("attack-worm.script", target)
		scp("attack-lite.script", target)
		exec("attack-worm.script", target, 1, args[0])
	}
}
function doAttack(log, servers) {
	for (var i = 0; i != servers.length; i++) {
		var target = servers[i]
		logMessage(log, "Attacking " + target)
		run("attack-lite.script", 1, args[0], target)
	}
}
function doHack(log, servers) {
	for (var i = 0; i != servers.length; i++) {
		var target = servers[i]
		logMessage(log, "Hacking " + target)
		scp("hack-lite.script", target)
		exec("hack-lite.script", target, threadCalc(log, target, hMem, wormMem), target)
	}
}

// Utils
/*
@ThreadCalc
@Description
	-Calc the number of threads to be used.
@Args 
	-log(Boolean), hostname(String), rMem(Float)[Mem Consumption] & rsMem(Float)[Mem Reserve] 
@TODO 
	-Make Thread calc split threads for attack-lite so we can attack little faster if the server isn't attacking then give all threads to hack.
*/
function threadCalc(log, hostname, rMem, rsMem) {
	var aMem = ((getServerMaxRam(hostname) - getServerUsedRam(hostname)) - rsMem)
	logMessage(log, "FreeMemory on " + hostname + ": " + aMem)
	var tCount = 1
	var memCount = rMem
	while (memCount < (aMem - rMem)) {
		memCount += rMem
		tCount++
	}
	logMessage(log, "threadCalc Result: " + tCount)
	return tCount
}
function logMessage(log, message) {
	if (log) tprint(message)
}
// Methods END
