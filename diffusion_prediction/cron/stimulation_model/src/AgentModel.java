import java.io.*;
import java.util.*;

/**
 * Created by fanrui on 15/6/24.
 */
public class AgentModel {
    private final static double PN = 0.45;
    private final static double PR = 0.029;
    private static long STEP = 0; //目前的step
    private final static long MAX_STEP = 10000;
    private static long HASHTAG = 0; //目前的hashtag

    static int readGraph(String fpath, Map<Integer, Set<Integer>> graph) throws IOException {
        // 读取网络
        BufferedReader br = new BufferedReader(new FileReader(new File(fpath)));
        String line = br.readLine();
        int nodeCnt = Integer.parseInt(line.split(" ")[0]);
        while((line = br.readLine()) != null) {
            String[] line_arr = line.split(" ");
            int follower = Integer.parseInt(line_arr[0]);
            int followee = Integer.parseInt(line_arr[1]);
            if(! graph.containsKey(followee)) {
                graph.put(followee, new HashSet<Integer>());
            }
            graph.get(followee).add(follower);
        }
        br.close();
        return nodeCnt;
    }
    public static void graphAddScreen(Map<Integer, Set<Integer>> graph, User[] users, int uid, Screen scr) {
        Set<Integer> uids;
        if(graph.containsKey(uid)) {
            uids = graph.get(uid);
        }
        else{
            uids = new HashSet();
        }
        for(int adjacent: uids) {
            User user = users[adjacent];
            user.addScreen(scr);
        }
    }
    public static void main(String[] args) throws IOException {
        // 用户有向网络，从被关注者指向关注者
        Map<Integer, Set<Integer>> graph = new HashMap<Integer, Set<Integer>>();
        String input = args[0];
        String output = args[1];
        System.out.println(input);
        System.out.println(output);
        int nodeCnt = readGraph(input, graph);
        User[] users = new User[nodeCnt];
        for(int i = 0; i < users.length; i++) {
            users[i] = new User();
        }
        int limit = (int)(nodeCnt);
        long start = System.currentTimeMillis();
        Random rand = new Random();
        PrintStream fout = new PrintStream(output);
        for(; STEP < MAX_STEP; STEP++) {
            /*
            for(User user: users) {
                user.delete(limit, STEP);
            }
            */
            int uid = rand.nextInt(nodeCnt);
            User selectedUser = users[uid];
            selectedUser.delete(limit, STEP);
            double randDouble = rand.nextDouble();
            if(randDouble < PN) {
                selectedUser.pushNew(HASHTAG, STEP);
                fout.printf("%s %s %s %s\n", STEP, uid, "pushNew", HASHTAG);
                graphAddScreen(graph, users, uid, new Screen(STEP, HASHTAG));
                HASHTAG++;
            }
            else{
                Queue<Screen> screen = selectedUser.getScreen();
                for(Screen scr: screen) {
                    double randDoublePr = rand.nextDouble();
                    if(randDoublePr < PR) {
                        selectedUser.retweet(scr, STEP);
                        fout.printf("%s %s %s %s\n", STEP, uid, "retweet", scr.getHashtag());
                        graphAddScreen(graph, users, uid, new Screen(STEP, scr.getHashtag()));
                    }
                }
            }
        }
        fout.close();
        long end = System.currentTimeMillis();
        System.out.println("耗时:" + (end - start));
    }
}
