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
                id: 'JavaScriptVariablesAndScope'
            }),
            new BlogModel({
                displayname: 'Azure 204 Notes',
                tag: 'Azure',
                subtags: [],
                timestamp: '22 Jul 2020',
                updated: '',
                id: 'AzureDeveloper204ExamNotes'
            }),
            new BlogModel({
                displayname: 'Events CRUD',
                tag: 'JavaScript',
                subtags: ['HTML', 'DOM'],
                timestamp: '21 Jul 2020',
                updated: '22 Jul 2020',
                id: 'EventCRUD'
            }),
            new BlogModel({
                displayname: 'Async Constructors',
                tag: 'JavaScript',
                subtags: [],
                timestamp: '27 Jul 2020',
                updated: '',
                id: 'AsyncConstructors'
            }),
            new BlogModel({
                displayname: 'Markdown Rendering',
                tag: 'JavaScript',
                subtags: ['PrismJs', 'MarkedJs'],
                timestamp: '01 Aug 2020',
                updated: '',
                id: 'MarkdownRendering'
            }),
            new BlogModel({
                displayname: 'Angular GitHub Pages',
                tag: 'Angular',
                subtags: ['GitHub'],
                timestamp: '26 Dec 2020',
                updated: '',
                id: 'AngularAndGitHubPages'
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

    constructor(args) {
        this.displayname = args.displayname || '';
        this.tag = args.tag || '';
        this.subtags = args.subtags || [];
        this.timestamp = args.timestamp || '';
        this.updated = args.updated || '';
        this.id = args.id || '';
    }

    get allTags() {
        return [this.tag, this.subtags].flat();
    }

    get allTagsLowerCase() {
        return [this.tag, this.subtags].flat().map(tag => tag = tag.toLocaleLowerCase());
    }
}
