from shutil import copyfile

def hasNumbers(inputString):
    return any(x.isdigit() for x in inputString)
def onlyNumbers(inputString):
    sString = inputString.strip()
    array = sString.split(" ")
    return int(array[0])
#copyfile('notes.chart', 'notes(unbroke).chart')
chart = open('notes.chart','r+')
array = chart.readlines()
start = array.index('[Events]\n')
numbers = []
for i in range(start,len(array)):
    if hasNumbers(array[i]) == True:
        numbers.append(onlyNumbers(array[i]))
    else:
        numbers.append(0)
brokenFlag = 0

for i in range(0,len(numbers)-1):
    if 0 < (numbers[i+1]-numbers[i]) < 10:
        brokenFlag = 1
        array[i+start] = ''

newchart = open('notes(unbroke).chart','w+')
for i in range(0,len(array)):
    newchart.write(array[i])
if brokenFlag == 1:
    print('Your chart had some broken notes. Check notes(unbroke).chart \nfor the fixed version. Press anything to exit.')
else:
    print('Your chart showed no errors. Press anything to exit.')
newchart.close()
print(input())