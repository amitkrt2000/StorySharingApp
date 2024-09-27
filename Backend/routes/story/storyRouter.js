const express = require('express');
const router = express.Router();
const Story = require('../../schemas/story');
const User = require('../../schemas/user');
const authMiddleware = require("../../middleware/authMiddleware"); // Make sure this path is correct

// Create story route
router.post('/create', authMiddleware, async (req, res, next) => {
    try {
        const { heading, description, slides, category } = req.body;
        console.log(req.body); // Check what the frontend sends

        const newStory = new Story({
            heading,
            description,
            slides,
            category,
            createdBy: req.user._id,
        });

        await newStory.save();
        res.status(201).send({ message: 'Story created successfully', story: newStory });
    } catch (err) {
        next(err); // Correct usage of next() for error handling
    }
});

// Get all stories with like count
router.get('/all', async (req, res, next) => {
    try {
        const stories = await Story.find();

        // Add like count to each slide
        const storiesWithLikeCount = stories.map(story => {
            const slidesWithLikeCount = story.slides.map(slide => ({
                ...slide._doc, // Get all existing slide fields
                likeCount: slide.likes.length // Add a likeCount field
            }));
            return {
                ...story._doc, // Get all existing story fields
                slides: slidesWithLikeCount // Replace slides with updated slides
            };
        });

        res.status(200).send({ message: 'Stories fetched successfully', stories: storiesWithLikeCount });
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Edit story route
router.put('/edit/:id', authMiddleware, async (req, res, next) => {
    try {
        const { heading, description, slides, category } = req.body;
        const storyId = req.params.id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).send({ message: 'Story not found' });
        }

        if (story.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        story.heading = heading || story.heading;
        story.description = description || story.description;
        story.slides = slides || story.slides;
        story.category = category || story.category;

        await story.save();
        res.status(200).send({ message: 'Story updated successfully', story });
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Like a slide
router.post('/like/:storyId/:slideIndex', authMiddleware, async (req, res, next) => {
    try {
        const { storyId, slideIndex } = req.params;
        const userId = req.user._id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).send({ message: 'Story not found' });
        }

        const slide = story.slides[slideIndex];
        if (!slide) {
            return res.status(404).send({ message: 'Slide not found' });
        }

        const alreadyLiked = slide.likes.includes(userId);
        if (alreadyLiked) {
            slide.likes = slide.likes.filter(id => id.toString() !== userId.toString());
        } else {
            slide.likes.push(userId);
        }

        await story.save();
        res.status(200).send({ message: 'Slide like updated successfully', story });
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Download a slide
router.get('/download/:storyId/:slideIndex', authMiddleware, async (req, res, next) => {
    try {
        const { storyId, slideIndex } = req.params;
        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).send({ message: 'Story not found' });
        }

        const slide = story.slides[slideIndex];
        if (!slide) {
            return res.status(404).send({ message: 'Slide not found' });
        }

        // Increment the downloads count for the slide
        slide.downloads += 1;
        await story.save();

        // Assuming slide.imageUrl contains the file path or URL to the image/video
        const filePath = slide.imageUrl; // e.g., '/path/to/image.jpg' or 'https://your-cdn.com/image.jpg'

        // If the file is stored locally, use res.download()
        if (filePath.startsWith('/')) {
            res.download(filePath, `slide-${storyId}-${slideIndex}`, (err) => {
                if (err) {
                    return res.status(500).send({ message: 'Error downloading file', error: err.message });
                }
            });
        } else {
            // If it's a URL (e.g., cloud storage like AWS S3), redirect to the file for download
            res.redirect(filePath);
        }
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Bookmark a story
router.put('/bookmark/:id', authMiddleware, async (req, res, next) => {
    try {
        const storyId = req.params.id;
        const userId = req.user._id;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).send({ message: 'Story not found' });
        }

        const isAlreadyBookmarked = story.bookmarks.includes(userId);
        if (isAlreadyBookmarked) {
            story.bookmarks = story.bookmarks.filter(id => id.toString() !== userId.toString());
            await story.save();
            return res.status(200).send({ message: 'Bookmark removed successfully', story });
        } else {
            story.bookmarks.push(userId);
            await story.save();
            return res.status(200).send({ message: 'Story bookmarked successfully', story });
        }
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Get stories by category with like count
router.get('/category/:category', async (req, res, next) => {
    try {
        const { category } = req.params;
        const stories = await Story.find({ category });

        const storiesWithLikeCount = stories.map(story => {
            const slidesWithLikeCount = story.slides.map(slide => ({
                ...slide._doc,
                likeCount: slide.likes.length
            }));
            return {
                ...story._doc,
                slides: slidesWithLikeCount
            };
        });

        res.status(200).send({ stories: storiesWithLikeCount });
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
    res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;
