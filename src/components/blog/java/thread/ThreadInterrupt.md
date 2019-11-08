> 一个线程可以调用interrupt()方法来中断线程。线程的中断是通过内部标志位来判断的，thread内有一个boolean型标志位。

线程中断后，可以调用静态方法Thread.interrupted()，来检查本线程是否已经中断，调用静态方法后会清除中断状态。非静态方法isInterrupted方法用于线程来查询另一个线程的中断状态，而且不会改变其中断状态。该线程中断后可进行判断并执行其他流程。

```java
//如果线程t已经中断，则返回
if (t.isInterrupted()){
    return;
}
```

或者用catch(interruptedException)捕捉中断异常，下文例子中的代码

```java
//用时13秒输出四行信息
try {
    for (int i = 0; i < importantInfo.length; i++) {
        //暂停4秒
        Thread.sleep(4000);

        threadMessage(importantInfo[i]);
    }
} catch (InterruptedException e) {
   threadMessage("catch到异常输出");
}
-------------------------------------------------------
//中断t线程
t.interrupt();
//当前线程等待，先执行t线程
t.join();
```
在t中断后，捕捉到中断异常，就会抛出异常，从而达到流程控制的作用。

join方法可以可以暂停当前运行的线程，并执行指定线程。

```java
 //当前线程等待1秒钟，先执行t线程
 t.join(1000);
```
 
下面是个学习demo。

```java
public class SimpleThreads {

    //静态方法，输出当前线程名称，以及其他信息
    static void threadMessage(String message){
        String threadName = Thread.currentThread().getName();
        System.out.format("%s: %s%n",threadName,message);
    }

    //私有内部类,实现runnable接口
    private static class MessageLoop implements Runnable{

        @Override
        public void run() {
            String[] importantInfo = {"First column"
                                     ,"Second column"
                                     ,"Third swimming"
                                     ,"forth fruite"};

            //用时13秒输出四行信息
            try {
                for (int i = 0; i < importantInfo.length; i++) {
                    //暂停4秒
                    Thread.sleep(4000);

                    threadMessage(importantInfo[i]);
                }
            } catch (InterruptedException e) {
               threadMessage("catch到异常输出");
            }
        }
    }

    //抛出线程中断异常
    public static void main(String[] args) throws InterruptedException{
        //定时一小时
        long patience = 1000;

        if (args.length>0){
            try {
                patience = Long.parseLong(args[0])*1000;
            } catch (NumberFormatException e) {
                System.err.println("Long包装，类型错误异常");
                System.exit(1);
            }
        }

        threadMessage("开始循环线程");
        //system获取当前时间
        long startTime = System.currentTimeMillis();
        Thread t = new Thread(new MessageLoop());
        t.start();

        while (t.isAlive()){
            threadMessage("线程仍在运行");

            //当前线程等待1秒钟，先执行t线程
            t.join(1000);
            //如果线程执行时间超过指定时间
            if ((System.currentTimeMillis()-startTime) > patience 
                  && t.isAlive()){
                threadMessage("等死劳资了");
                t.interrupt();

                //等待
                t.join();
            }
        }
        threadMessage("总算完事了");
    }
}
```