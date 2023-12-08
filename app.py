import os # Available
from Naked.toolshed.shell import execute_js # Packages
from subprocess import call # Available

try:
	nodeJS = os.system('node index.js') # os
	nodeJs = call(['node','index.js']) # subprocess
	nodejS = execute_js('index.js') # Naked
except:
	pass