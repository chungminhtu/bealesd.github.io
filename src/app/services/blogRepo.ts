import { Injectable } from '@angular/core';
import { Utilities } from '../helpers/utilites'

@Injectable({
    providedIn: 'root',
})
export class BlogRepo {
    blogIndexes: BlogModel[];
    utilities: any;

    constructor() {
        this.blogIndexes = [
            new BlogModel({
                displayname: 'Variables And Scope',
                tag: 'JavaScript',
                subtags: [],
                timestamp: '13 Jun 2020',
                updated: '',
                id: 'JavaScriptVariablesAndScope',
                summary: 'Choose the wrong type declaration or declare it in the wrong place, prepare for unexpected behaviour!',
                thumbnail: '/assets/blogs/images/variables-scope-thumbnail.jpg',
                author: 'David Beales'
            }),
            new BlogModel({
                displayname: 'Azure 204 Notes',
                tag: 'Azure',
                subtags: [],
                timestamp: '22 Jul 2020',
                updated: '',
                id: 'AzureDeveloper204ExamNotes',
                summary: 'My 204 Exam notes, a scrambled mess!',
                thumbnail: '/assets/blogs/images/azure-logo-thumbnail.jpg',
                author: 'David Beales'
            }),
            new BlogModel({
                displayname: 'Events CRUD',
                tag: 'JavaScript',
                subtags: ['HTML', 'DOM'],
                timestamp: '21 Jul 2020',
                updated: '22 Jul 2020',
                id: 'EventCRUD',
                summary: 'Manage DOM events listeners safely, with events CRUD.',
                thumbnail: '/assets/blogs/images/crud_blue_thumbnail.jpg',
                author: 'David Beales'
            }),
            new BlogModel({
                displayname: 'Async Constructors',
                tag: 'JavaScript',
                subtags: [],
                timestamp: '27 Jul 2020',
                updated: '',
                id: 'AsyncConstructors',
                summary: 'JavaScript can support async constructors, with closures.',
                thumbnail: '/assets/blogs/images/async-constructors-new-thumbnail.jpg',
                author: 'David Beales'
            }),
            new BlogModel({
                displayname: 'Markdown Rendering',
                tag: 'JavaScript',
                subtags: ['PrismJs', 'MarkedJs'],
                timestamp: '01 Aug 2020',
                updated: '',
                id: 'MarkdownRendering',
                summary: 'Render Markdown in the browser, with added PrismJs styling.',
                thumbnail: '/assets/blogs/images/prism-thumbnail.jpg',
                author: 'David Beales'
            }),
            new BlogModel({
                displayname: 'Angular GitHub Pages',
                tag: 'TypeScript',
                subtags: ['Angular', 'GitHub'],
                timestamp: '26 Dec 2020',
                updated: '',
                id: 'AngularAndGitHubPages',
                summary: 'Host your Angular website for free with GitHub Pages.',
                thumbnail: '/assets/blogs/images/github-pages-blue-thumbnail.jpg',
                author: 'David Beales'
            })
        ];

        this.utilities = new Utilities();
    }

    get blogs(): BlogModel[] {
        const blogs = this.blogIndexes.filter((blog) => {
            const blogInFuture = this.utilities.dateInFuture(new Date(blog.timestamp));
            if (!blogInFuture) return blog;
        })
        return blogs;
    }

    getBlogsByTags(tags: string[]): BlogModel[] {
        if (tags.length === 0 || tags[0].trim() === '') return this.blogs;

        return this.blogs
            .filter(blog => {
                const blogHasAllTags = tags.map(tag => tag.toLowerCase()).every((tag) => {
                    return blog.allTagsLowerCase.includes(tag);
                });
                return blogHasAllTags;
            })
            .sort((a: BlogModel, b: BlogModel) => {
                const nameA = a.displayname.toLowerCase();
                const nameB = b.displayname.toLowerCase();
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            });
    }

    getPostsBySearchTerm(searchTerm: string): BlogModel[] {
        if (searchTerm.trim() === '') return this.blogs;

        return this.blogs
            .filter(blog => blog.displayname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
            .sort((a: BlogModel, b: BlogModel) => {
                const nameA = a.displayname.toLowerCase();
                const nameB = b.displayname.toLowerCase();
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            });
    }

    getPostsBySearchTermAndTag(searchTerm: string, tags: string[]): BlogModel[] {
        const blogsByTag = this.getBlogsByTags(tags);
        const blogsSearchTerm = this.getPostsBySearchTerm(searchTerm);
        return blogsByTag
            .filter(blog => blogsSearchTerm.includes(blog))
            .sort((a: BlogModel, b: BlogModel) => {
                const nameA = a.displayname.toLowerCase();
                const nameB = b.displayname.toLowerCase();
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            });
    }

    getAllUniqueTags(): string[] {
        return [...new Set(this.blogs.flatMap(blog => blog.allTags))]
            .sort((a: string, b: string) => {
                a = a.toLowerCase();
                b = b.toLowerCase();
                return a < b ? -1 : a > b ? 1 : 0;
            });
    }
}

class BlogModel {
    displayname: string
    tag: string
    subtags: string[]
    timestamp: string
    updated: string
    id: string
    summary: string
    thumbnail: string
    author: string

    constructor(args) {
        this.displayname = args.displayname || '';
        this.tag = args.tag || '';
        this.subtags = args.subtags || [];
        this.timestamp = args.timestamp || '';
        this.updated = args.updated || '';
        this.id = args.id || '';
        this.summary = args.summary || '';
        this.thumbnail = args.thumbnail || '';
        this.author = args.author || ''
    }

    get allTags() {
        return [this.tag, this.subtags].flat();
    }

    get allTagsLowerCase() {
        return [this.tag, this.subtags].flat().map(tag => tag = tag.toLocaleLowerCase());
    }
}
