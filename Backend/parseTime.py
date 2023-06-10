from pyunit_time import Time as pyt
from datetime import datetime
import pytz
import json, re, sys
sys.stdin.reconfigure(encoding='utf-8')


# 输入对应的时间简介
brief = input()

# 如果有“前”或“之前” 认为是设定结束时间
isEndTime = False 
# pyunit对之前处理有bug 提前删除“前”字样
if '之前' in brief:
    brief = brief.replace('之前', '')
    isEndTime = True
elif '前' in brief:
    brief = brief.replace('前', '')
    isEndTime = True

processed = pyt('').parse(brief)
isTimeExtract = (len(processed) > 0)

ret = {}

def ten_to_number(string: str) -> str:
    temporary = []
    ten = {
        '一': '1',
        '二': '2',
        '两': '2',
        '三': '3',
        '四': '4',
        '五': '5',
        '六': '6',
        '七': '7',
        '八': '8',
        '九': '9'
    }
    for index, char in enumerate(string):
        if char == '十':
            if (index == 0) or (not ten.get(string[index - 1])):
                if index != len(string) - 1:
                    if ten.get(string[index + 1]):
                        temporary.append('1')
                    else:
                        temporary.append('10')
            else:
                if index != len(string) - 1:
                    if ten.get(string[index + 1]):
                        pass
                    else:
                        temporary.append('0')
        else:
            temporary.append(ten.get(char, char))
    return ''.join(temporary)


def remove_conjunctions(string, remove_symbol=False, remove_re=None) -> str:
    if remove_re:
        match = remove_re
        return re.sub(match, '', string)
    else:
        string = string.replace('的', '').replace('：', ':')
        rule = r'(\d+-\d+(-\d+)?)|(\d+\.\d+(\.\d+)?)|(\d+/\d+(/\d+)?)|\d+:\d+(:\d+)?'
        if not re.search(rule, string):
            string = re.sub(r'\s+', '', string)
    if remove_symbol:
        string = re.sub(r'\s+', '', string)
    return string


brief = ten_to_number(brief)
brief = remove_conjunctions(brief)


# 在原字符串去除关键字
if isTimeExtract:
    brief = brief.replace(processed[0]['key'], '')


if isTimeExtract:
    # 将输入的日期时间字符串转换为datetime对象（假设输入时间为北京时间）
    input_date = datetime.strptime(processed[0]['keyDate'], "%Y-%m-%d %H:%M:%S")

    # 创建北京时区对象
    beijing_tz = pytz.timezone('Asia/Shanghai')

    # 将输入时间设置为北京时区
    input_date = beijing_tz.localize(input_date)

    # 下面对时间做取整处理
    if '后' in processed[0]['key']:
        pass    # xxx时间后，则不做取整
    elif '秒' not in processed[0]['key']:
        input_date = input_date.replace(second=0)
        minKey = ['刻', '半', '分', '分钟']
        if all(substring not in processed[0]['key'] for substring in minKey):
            input_date = input_date.replace(minute=0)
            minKey = ['时', '点', '上午', '下午', '早', '晚']
            if all(substring not in processed[0]['key'] for substring in minKey):
                input_date = input_date.replace(hour=0)
    
        # 转换为格林威治时间（UTC）
    gmt_date = input_date.astimezone(pytz.utc)


    # 根据需要的格式转换为字符串
    output_date_string = gmt_date.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    if isEndTime:
        # 获取当前时间
        now = datetime.now()
        # 将当前时间转换为GMT时间
        gmt = pytz.timezone('GMT')
        gmt_time = now.astimezone(gmt)
        now_date_string = gmt_time.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        ret = {
            'brief': brief,
            'time':{
                'beginTime':{
                    'date': now_date_string,
                    'time': now_date_string
                },
                'endTime':{
                    'date': output_date_string,
                    'time': output_date_string
                }
            }
        }
    else:
        ret = {
            'brief': brief,
            'time':{
                'beginTime':{
                    'date': output_date_string,
                    'time': output_date_string
                },
                'endTime':{
                }
            }
        }
else:
    ret = {  
        'brief': brief,
        'time':{

        }
    }

print(json.dumps(ret))