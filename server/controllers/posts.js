import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find({
          $or: [
            { isPrivate: false },
            { creator: req.userId },
            { isPrivate: { $exists: false }}
          ]
        }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { search, tags, site, state, amps, water, pets, sewer, waterfront } = req.query;
    
    try {
        const filters = {}; // Initialize the filters object

      // Define the filter properties to represent the filter criteria
      if (search) {
        filters.title = { $regex: new RegExp(search, 'i') };
      }
      
      // Apply the tags filter with an "in" query
      if (tags) {
        const tagRegexArray = tags.split(',').map(tag => new RegExp(tag.trim(), 'i'));
        filters.tags = { $in: tagRegexArray };
      }
      
      // Apply the site filter
      if (site) {
        filters.site = { $regex: new RegExp(site, 'i') };
      }
      
      // Apply the state filter
      if (state) {
        filters.state = { $regex: new RegExp(state, 'i') };
      }
      
      // Apply the amps filter if "amps" is true
      if (amps === 'true') {
        filters.amps = 'Y';
      }
      
      // Apply the water filter if "water" is true
      if (water === 'true') {
        filters.water = 'Y';
      }
      
      // Apply the pets filter if "pets" is true
      if (pets === 'true') {
        filters.pets = 'Y';
      }
      
      // Apply the sewer filter if "sewer" is true
      if (sewer === 'true') {
        filters.sewer = 'Y';
      }

      if (waterfront === 'true') {
        filters.$and = [
          { waterfront: { $ne: '' } },  // Exclude documents where waterfront is 'N'
          { waterfront: { $exists: true } },  // Exclude documents where waterfront doesn't exist
        ];
      }

      // Filter posts based on the defined criteria
      const posts = await PostMessage.find({
        $and: [
          filters,
          {
            $or: [
              {isPrivate: false},
              {creator: req.userId},
              { isPrivate: { $exists: false }} 
            ]
          }
        ]
      });
      
      res.json({ data: posts });
    } catch (error) {    
      res.status(404).json({ message: error.message });
    }
  }

  export const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const posts = await PostMessage.find({
            name,
            $or: [
                { isPrivate: false }, // Include public posts
                { creator: req.userId }, // Include posts created by the requester
                { isPrivate: { $exists: false }}
            ]
        });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
  console.log(req);  
  const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags, state, amps, pets, sewer, water, waterfront } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id, state, amps, pets, sewer, water, waterfront };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export default router;