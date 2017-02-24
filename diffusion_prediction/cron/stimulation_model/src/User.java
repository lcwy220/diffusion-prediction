import java.util.*;

/**
 * Created by fanrui on 15/6/24.
 */
class Screen {
    private long step;
    private long hashtag;

    public Screen(long step, long hashtag) {
        this.step = step;
        this.hashtag = hashtag;
    }

    public long getStep() {
        return step;
    }

    public void setStep(long step) {
        this.step = step;
    }

    public long getHashtag() {
        return hashtag;
    }

    public void setHashtag(long hashtag) {
        this.hashtag = hashtag;
    }
}
class Memory {
    private long step;
    private long hashtag;

    public Memory(long step, long hashtag) {
        this.step = step;
        this.hashtag = hashtag;
    }

    public long getStep() {
        return step;
    }

    public void setStep(long step) {
        this.step = step;
    }

    public long getHashtag() {
        return hashtag;
    }

    public void setHashtag(long hashtag) {
        this.hashtag = hashtag;
    }
}
public class User {
    /*
    用户类，存储用户的sceen和memory
     */
    private Queue<Screen> screen;
    private LinkedList<Memory> memory;

    public User() {
        screen = new LinkedList();
        memory = new LinkedList();
    }

    public void pushNew(long HASHTAG, long STEP) {
        // 推送新的hashtag
        addMemory(new Memory(STEP, HASHTAG));
    }

    public void retweet(Screen scr, long STEP) {
        // 从screen中转发一个hashtag
        addMemory(new Memory(STEP, scr.getHashtag()));
    }

    public void addScreen(Screen scr) {
        // 添加到screen中
        screen.add(scr);
    }
    private void addMemory(Memory mem) {
        // 添加到memory中
        memory.add(mem);
    }

    public void delete(int limit, long STEP) {
        Screen scr;
        while((scr = screen.peek()) != null) {
            if(STEP - scr.getStep() > limit)
                screen.remove();
            else
                break;
        }
        Memory mem;
        while((mem = memory.peek()) != null) {
            if(STEP - mem.getStep() > limit) {
                memory.remove();
            }
            else
                break;
        }
    }

    public Queue<Screen> getScreen() {
        return screen;
    }

    public void setScreen(Queue<Screen> screen) {
        this.screen = screen;
    }

    public LinkedList<Memory> getMemory() {
        return memory;
    }

    public void setMemory(LinkedList<Memory> memory) {
        this.memory = memory;
    }
}
