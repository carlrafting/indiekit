import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getPostType } from "../../lib/post-type-discovery.js";

describe("endpoint-media/lib/post-type-discovery", () => {
  it("Discovers note post type", () => {
    const result = getPostType({
      type: "entry",
      content: "Note content",
    });

    assert.equal(result, "note");
  });

  it("Discovers note post type (with name)", () => {
    const result = getPostType({
      type: "entry",
      name: "Note title",
      content: "Note title: Note content",
    });

    assert.equal(result, "note");
  });

  it("Discovers note post type (with summary)", () => {
    const result = getPostType({
      type: "entry",
      name: "Note title",
      summary: "Note summary",
    });

    assert.equal(result, "note");
  });

  it("Discovers article post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Article title",
      content: "Article content",
    });

    assert.equal(result, "article");
  });

  it("Discovers article post type (with HTML)", () => {
    const result = getPostType({
      type: "entry",
      name: "Article title",
      content: {
        html: "<p>Article content in <em>HTML</em> format.</p>",
      },
    });

    assert.equal(result, "article");
  });

  it("Discovers article post type (with plaintext)", () => {
    const result = getPostType({
      type: "entry",
      name: "Article title",
      content: {
        text: "Content in plaintext format.",
      },
    });

    assert.equal(result, "article");
  });

  it("Discovers article post type (with HTML and plaintext)", () => {
    const result = getPostType({
      type: "entry",
      name: "Article title",
      content: {
        html: "<p>Article content in <em>HTML</em> format.</p>",
        text: "Article content in plaintext format.",
      },
    });

    assert.equal(result, "article");
  });

  it("Discovers article post type (with summary)", () => {
    const result = getPostType({
      type: "entry",
      name: "Article title",
      summary: "Article summary",
      content: {
        html: "<p>Article content in <em>HTML</em> format.</p>",
        text: "Article content in plaintext format.",
      },
    });

    assert.equal(result, "article");
  });

  it("Discovers photo post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Photo title",
      photo: ["https://website.example/photo.jpg"],
    });

    assert.equal(result, "photo");
  });

  it("Discovers video post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Video title",
      video: ["https://website.example/video.mp4"],
    });

    assert.equal(result, "video");
  });

  it("Discovers audio post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Audio title",
      audio: ["https://website.example/audio.mp3"],
    });

    assert.equal(result, "audio");
  });

  it("Discovers like post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Like title",
      "like-of": "https://website.example",
    });

    assert.equal(result, "like");
  });

  it("Discovers repost post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Repost title",
      "repost-of": "https://website.example",
    });

    assert.equal(result, "repost");
  });

  it("Discovers bookmark post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Bookmark title",
      "bookmark-of": "https://website.example",
    });

    assert.equal(result, "bookmark");
  });

  it("Discovers quotation post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Quotation title",
      "quotation-of": "https://website.example",
      content: "Quotation content",
    });

    assert.equal(result, "quotation");
  });

  it("Discovers rsvp post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Event title",
      rsvp: "yes",
      "in-reply-to": "https://website.example",
    });

    assert.equal(result, "rsvp");
  });

  it("Discovers reply post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Reply title",
      "in-reply-to": "https://website.example",
      content: "Reply content",
    });

    assert.equal(result, "reply");
  });

  it("Discovers watch post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Watch title",
      "watch-of": "https://website.example/video.mp4",
    });

    assert.equal(result, "watch");
  });

  it("Discovers listen post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Listen title",
      "listen-of": "https://website.example/audio.mp3",
    });

    assert.equal(result, "listen");
  });

  it("Discovers read post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Read title",
      "read-of": "https://website.example/article",
    });

    assert.equal(result, "read");
  });

  it("Discovers checkin post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Checkin title",
      checkin: "https://website.example/place",
    });

    assert.equal(result, "checkin");
  });

  it("Discovers collection post type", () => {
    const result = getPostType({
      type: "entry",
      name: "Collection title",
      children: [
        "https://website.example/child-1",
        "https://website.example/child-2",
      ],
    });

    assert.equal(result, "collection");
  });

  it("Discovers event post type", () => {
    const result = getPostType({
      type: "event",
      name: "Event title",
    });

    assert.equal(result, "event");
  });
});