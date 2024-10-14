class YouToData {
        constructor() {
            this.apiKey = ''; // API key
            this.videoResults = []; // Array to store video results
        }

        getInfo() {
            return {
                id: 'youtubeData',
                name: 'YouTube Data',
                blocks: [
                    {
                        opcode: 'setApiKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set API key to [apiKey]',
                        arguments: {
                            apiKey: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        },
                        color: '#FF0000' // YouTube red color
                    },
                    {
                        opcode: 'searchVideos',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'search YouTube for [query]',
                        arguments: {
                            query: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Scratch tutorials'
                            }
                        },
                        color: '#FF0000' // YouTube red color
                    },
                    {
                        opcode: 'getVideoTitles',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get video titles',
                        color: '#FF0000' // YouTube red color
                    },
                    {
                        opcode: 'getVideoDescriptions',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get video descriptions',
                        color: '#FF0000' // YouTube red color
                    },
                    {
                        opcode: 'getVideoViewCounts',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get video view counts',
                        color: '#FF0000' // YouTube red color
                    },
                    {
                        opcode: 'getChannelNames',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get channel names',
                        color: '#FF0000' // YouTube red color
                    },
                    {
                        opcode: 'getVideoThumbnails',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get video thumbnails',
                        color: '#FF0000' // YouTube red color
                    }
                ]
            };
        }

        // Set the API key from user input
        setApiKey(args) {
            this.apiKey = args.apiKey;
            console.log(`API key set to: ${this.apiKey}`); // For debugging
        }

        // Search for YouTube videos
        async searchVideos(args) {
            if (!this.apiKey) {
                console.error('API key is not set. Please set the API key first.');
                return;
            }

            const query = args.query;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${this.apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                // Process the data and store the video results
                this.videoResults = data.items.map(item => ({
                    title: item.snippet.title,
                    description: item.snippet.description,
                    videoId: item.id.videoId,
                    channelTitle: item.snippet.channelTitle,
                    thumbnail: item.snippet.thumbnails.default.url
                }));

                console.log(`Search results for "${query}":`, this.videoResults); // For debugging
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        }

        // Retrieve the current video titles
        getVideoTitles() {
            return this.videoResults.length > 0
                ? this.videoResults.map(video => video.title).join(', ')
                : 'No results found. Please perform a search.';
        }

        // Retrieve the current video descriptions
        getVideoDescriptions() {
            return this.videoResults.length > 0
                ? this.videoResults.map(video => video.description).join('\n')
                : 'No results found. Please perform a search.';
        }

        // Retrieve the current video view counts (Note: We need to make another API call to get this)
        async getVideoViewCounts() {
            if (this.videoResults.length === 0) return 'No results found. Please perform a search.';

            const videoIds = this.videoResults.map(video => video.videoId).join(',');
            const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${this.apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                const viewCounts = data.items.map(item => item.statistics.viewCount);
                return viewCounts.join(', ');
            } catch (error) {
                console.error('Error fetching view counts:', error);
                return 'Error fetching view counts.';
            }
        }

        // Retrieve the current channel names
        getChannelNames() {
            return this.videoResults.length > 0
                ? this.videoResults.map(video => video.channelTitle).join(', ')
                : 'No results found. Please perform a search.';
        }

        // Retrieve the current video thumbnails
        getVideoThumbnails() {
            return this.videoResults.length > 0
                ? this.videoResults.map(video => video.thumbnail).join(', ')
                : 'No results found. Please perform a search.';
        }
    }

    Scratch.extensions.register(new YouToData());
