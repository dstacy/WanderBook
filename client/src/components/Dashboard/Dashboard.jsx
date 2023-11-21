import React, {useMemo, useState} from 'react'
import Layouts from "../Layouts";
import useStyles from "./styles";
import Card from "../common/Card";
import CardTitle from "../common/Card/CardTitle";
import CardContent from "../common/Card/CardContent";
import {Typography} from "@material-ui/core";
import Gallery from "./Gallery";
import {useSelector} from "react-redux";

export default () => {
    const classes = useStyles();
    const { posts } = useSelector((state) => state.posts);
    const { lists } = useSelector((state) => state.lists);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const postInfo = useMemo(() => {
        const mostCommenter = {};
        const mostLiker = {};
        let newest = {};
        let oldest = {};

        posts.forEach((post) => {
            // Find most commenter name
            post.comments.forEach((comment) => {
                const commenterName = comment.split(":")[0].trim();
                mostCommenter[commenterName] = (mostCommenter[commenterName] || 0) + 1;
            });

            // Find most liker name
            post.likes.forEach((likerId) => {
                const likerName = post.name; // Assuming liker's name is the same as the post creator's name
                mostLiker[likerName] = (mostLiker[likerName] || 0) + 1;
            });

            // Find newest post
            if (!newest.createdAt || post.createdAt > newest.createdAt) {
                newest = post;
            }

            // Find oldest post
            if (!oldest.createdAt || post.createdAt < oldest.createdAt) {
                oldest = post;
            }
        });

        // Format createdAt dates into '9-5-2023' format
        if (newest.createdAt) {
            newest.createdAt = new Date(newest.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            });
        }
        if (oldest.createdAt) {
            oldest.createdAt = new Date(oldest.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            });
        }

        const mostCommenterName = Object.keys(mostCommenter).reduce((a, b) =>
            mostCommenter[a] > mostCommenter[b] ? a : b, ""
        );

        const mostLikerName = Object.keys(mostLiker).reduce((a, b) =>
            mostLiker[a] > mostLiker[b] ? a : b, ""
        );

        return {
            mostLikerName,
            mostCommenterName,
            newestDate: newest.createdAt,
            oldestDate: oldest.createdAt,
        };
    }, [posts]);

    const listInfo = useMemo(() => {
        // Filter lists by creator
        const userLists = lists.filter((list) => list.creator === user.result.name);

        // Count occurrences of each item in the filtered lists
        const itemCounts = userLists.reduce((acc, list) => {
            list.items.forEach((item) => {
                const itemName = `${item.name} (${item.category})`;
                acc[itemName] = (acc[itemName] || 0) + 1;
            });
            return acc;
        }, {});

        // Find most and least repeated items
        const mostRepeatedItem =
            Object.keys(itemCounts).length > 0
                ? Object.keys(itemCounts).reduce((a, b) => (itemCounts[a] > itemCounts[b] ? a : b))
                : null;

        const leastRepeatedItem =
            Object.keys(itemCounts).length > 0
                ? Object.keys(itemCounts).reduce((a, b) => (itemCounts[a] < itemCounts[b] ? a : b))
                : null;

        // Number of contributions for all items
        const contributions = Object.values(itemCounts).reduce((acc, count) => acc + count, 0);

        return {
            mostRepeatedItem,
            leastRepeatedItem,
            contributions,
            userListsCount: userLists.length,
        };
    }, [lists, user.result.name]);

    return (
      <Layouts>
          <div className={classes.pageWrapper}>
              <Card gridArea="card-1">
                  <CardTitle title={"Posts"} count={posts.length || 0}/>

                  <CardContent>
                      { !!posts.length ? <>
                          <Typography variant="p" component="p" className={classes.contentText}>Most Liked: {postInfo.mostLikerName}</Typography>
                          <Typography variant="p" component="p" className={classes.contentText}>Most Commented On: {postInfo.mostCommenterName}</Typography>

                          <Typography variant="p" component="p" className={classes.contentText}>Newest: {postInfo.newestDate}</Typography>
                          <Typography variant="p" component="p" className={classes.contentText}>Oldest: {postInfo.oldestDate}</Typography>
                      </> :
                          <Typography variant="p" component="p" className={classes.contentText}>No posts</Typography>
                      }

                  </CardContent>
              </Card>
              <Card gridArea="card-2">
                  <CardTitle title={"Lists"} count={listInfo.userListsCount || 0}/>

                  <CardContent>
                      {!!lists.length ? <>
                          <Typography variant="p" component="p" className={classes.contentText}>Most Repeated Item: {listInfo.mostRepeatedItem}</Typography>
                          <Typography variant="p" component="p" className={classes.contentText}>Least Repeated Item: {listInfo.leastRepeatedItem}</Typography>
                          <Typography variant="p" component="p" className={classes.contentText}>Number of total list items: {listInfo.contributions}</Typography>
                      </>:
                          <Typography variant="p" component="p" className={classes.contentText}>No lists</Typography>
                      }

                  </CardContent>
              </Card>
              <Card gridArea="card-3">
                  <CardTitle title={"Gallery"}/>
                  <CardContent>
                      <Gallery images={posts}/>
                  </CardContent>
              </Card>
          </div>
      </Layouts>
  )
}