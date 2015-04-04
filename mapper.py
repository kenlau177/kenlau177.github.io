#!/usr/bin/python
 
import json
import sys
import re
 
for line in sys.stdin:
		data = json.loads(line)
		if("text" in data.keys()):
				sentence = data['text']
				texts = re.split(' ', sentence)
				for j in range(len(texts)):
						word = texts[j]
						if(len(word) == 0 or word == '\n' or word == '\n\n'):
								continue
						word = word.encode('utf-8')
						if word.isalpha():
								print "{0}\t{1}".format(word, '1')