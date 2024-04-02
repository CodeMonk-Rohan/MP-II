from yt_dlp import YoutubeDL
import pprint
import os
import customLogger
import sys

print(os.getcwd())
print("this message goes through")
with open(os.getcwd()+"/"+"ESPER.txt", "w") as f:
    print("This is weird, but this doesnt appear on standard output")
    f.write("susbaka")

os.mkdir("NEWDIRECTORY")