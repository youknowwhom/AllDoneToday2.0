import pdfplumber
import json
import re

weekday = {"一": "mon" , "二": "tue", "三": "wed", "四": "thu", "五": "fri", "六": "sat", "日": "sun"}

def extractTime(str):
    ret = {}
    # 多周
    matchObj = re.match( r'星期(.)(\d+)-(\d+)节\[(\d+)-(\d+)(.?)\]', str)
    if matchObj:
        ret['weekday'] = weekday[matchObj.group(1)]
        ret['startTime'] = int(matchObj.group(2))
        ret['endTime'] = int(matchObj.group(3))
        ret['weeks'] = []
        for i in range(int(matchObj.group(4)), int(matchObj.group(5)) + 1):
            if matchObj.group(6) == '':
                ret['weeks'].append(i)
            elif matchObj.group(6) == '单' and i % 2 == 1:
                ret['weeks'].append(i)
            elif matchObj.group(6) == '双' and i % 2 == 0:
                ret['weeks'].append(i)
        return ret
    # 单周
    matchObj = re.match( r'星期(.)(\d+)-(\d+)节\[(\d+)]', str)
    if matchObj:
        ret['weekday'] = weekday[matchObj.group(1)]
        ret['startTime'] = int(matchObj.group(2))
        ret['endTime'] = int(matchObj.group(3))
        ret['weeks'] = [int(matchObj.group(4))]
        return ret
            

def pack(line):
    ret = []
    infoDict = {}
    infoDict['courseId'] = line[0]
    infoDict['courseName'] = line[1]
    infoDict['teacher'] = line[6]
    infoDict['score'] = line[5]
    infoDict['place'] = line[8]
    
    for time in line[7].split(','):
        timeDict = extractTime(time)
        newDict = dict(list(infoDict.items()) + list(timeDict.items()))
        ret.append(newDict)
    
    return ret


url = input()
# 读取pdf文件，保存为pdf实例
pdf =  pdfplumber.open(url) 

table = []
for page in range(len(pdf.pages)):
    new_table = pdf.pages[page].extract_tables(table_settings={})
    if len(new_table) > 1 and page == 0:
        table += new_table[1]
    elif page:
        table += new_table[0]


table = [[re.sub('\(.*?\)','', item.replace('\n', '').replace(' ', '')) for item in line[1:]] for line in table[1:]]


tableProcessed = []
for line in table:
    if line[7] != '':
        tableProcessed += pack(line)

tableProcessed = { 'courses' : tableProcessed }

print(json.dumps(tableProcessed))

