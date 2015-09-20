f = open("data.csv", "r")
inputData = f.read()

inputData = inputData.replace("\n", "\"\n\"")
inputData = "\"" + inputData + "\""

f.close()
f2 = open("data.csv", "w")
f2.write(inputData)
f2.close()