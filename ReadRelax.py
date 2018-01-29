##speed read ##
import time
import graphics
from graphics import *

booktitle = "title"

def input_rw():
    f = open("input.txt",'r+');
    val = f.read();
    val = float(val);
    f.seek(0);
    f.truncate();
    f.write("1");
    f.close();
    return val;

def input_read_only():
    f = open("input.txt",'r');
    val = f.read();
    val = float(val);
    f.close();
    return val;

def inc_cond(num,last,t_inc):

    if num == 1:
        #print (last);
        return last;

    elif num == 0:
        t_inc = 0;
        #print (t_inc);
        return t_inc;

    elif num == 2:
        t_inc = last - 0.02
        t_inc = round(t_inc,2)
        #print (t_inc);
        return t_inc;

    elif num == 3:
        t_inc = last + 0.02
        t_inc = round(t_inc,2)
        #print (t_inc);
        return t_inc

def text_draw(st,win):
    word = Text(Point(500/2,700/2),st); ##format word
    word.setSize(30);
    word.setStyle("bold");
    word.setTextColor("black");
    word.draw(win);
    return word

def perc_draw(win, percDisplay):
    percentFill = Circle(Point(460,660), 60) # set center and radius
    percentFill.setOutline('black')
    percentFill.setFill('black')
    percentFill.draw(win)
    graphDisplay = Text(Point(445, 645), str(percDisplay)+"%")
    graphDisplay.setTextColor('white')
    graphDisplay.setStyle('italic')
    graphDisplay.setSize(15)
    graphDisplay.draw(win)

def wordsperminute(win, t_inc):
    wpmbox = Rectangle(Point(320, 640), Point(395, 660))
    wpmbox.setFill('white')
    wpmbox.setOutline('white')
    wpmbox.draw(win)
    if t_inc > 0:
        wpm = 60/t_inc
    else:
        wpm = 0
    wordpm = Text(Point(375, 655), round(wpm))
    wordpm2 = Text(Point(330, 655), "WPM: ")

    wordpm.setTextColor('black')
    wordpm.setSize(15)
    wordpm.draw(win)

    wordpm2.setTextColor('black')
    wordpm2.setSize(15)
    wordpm2.draw(win)

def reformatText():
    z = open(booktitle+".txt",'r+');
    lines = z.readlines()
    array_length = len(lines)
    z.seek(0)
    z.truncate()
    for g in range(array_length):
        z.write(lines[g])

def main():
    num_lines = sum(1 for line in open(booktitle+'.txt'))
    #print (num_lines)
    f = open(booktitle+".txt",'r');
    win = GraphWin("ReadRelax",500,700)
    win.setBackground("black");

    whitebox = Rectangle(Point(35, 35), Point(465, 665))
    whitebox.setFill('white')
    whitebox.draw(win)

    title = Text(Point(500/2, 70), booktitle)
    title.setTextColor('black')
    title.setSize(12)
    title.setStyle('italic')
    title.draw(win)

    txt = f.readline();
    t_inc = 0.26
    timeWait = True
    percentCount = 0
    num = 1
    last = t_inc
    while txt:
        line =  txt.split();
        for i in line:
            percentDisplay = (int(1+(percentCount/num_lines)*100))
            perc_draw(win, percentDisplay)

        ## num changes, does not write
            num = input_read_only();
            last = t_inc
        ## if num is not pause
            if num != 0:
                num = input_rw()
            t_inc = inc_cond(num,last,t_inc) #changes value of time increment

            word = text_draw(i,win) #draw word on window
            time.sleep(t_inc); # time buffer
            wordsperminute(win, t_inc)

            while t_inc == False:  #pause
                time.sleep(0.4);
                num = input_read_only();
                #print (t_inc);
                if (num == 1):
                    t_inc = inc_cond(num,last,t_inc);
            word.undraw()
        txt = f.readline();
        percentCount = percentCount + 1
    return;



reformatText()
main()
