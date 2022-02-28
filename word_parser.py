import os 
import csv
import pandas as pd

word_list = []
with open('words.txt', 'r') as words:
  lines = words.readlines()
print(len(lines))
for line in lines:
  try:
    word_list.append(line.split()[1])
    print(" '"+ line.split()[1] + "',")
  except:
    continue



