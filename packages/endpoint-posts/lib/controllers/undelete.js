import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";
import { getPostData, getPostName } from "../utils.js";

export const undeleteController = {
  /**
   * Confirm post to undelete
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async get(request, response) {
    const { access_token, scope } = request.session;
    const back = path.dirname(request.baseUrl + request.path);

    if (scope.includes("create") || scope.includes("draft")) {
      const { application, publication } = request.app.locals;
      const { id } = request.params;
      const post = await getPostData(
        id,
        application.micropubEndpoint,
        access_token
      );

      return response.render("undelete-post", {
        title: response.__("posts.undelete.title"),
        back,
        parent: { text: getPostName(post, publication) },
      });
    }

    response.redirect(back);
  },

  /**
   * Post undelete action to Micropub endpoint
   *
   * @param {object} request - HTTP request
   * @param {object} response - HTTP response
   * @returns {object} HTTP response
   */
  async post(request, response) {
    const { access_token } = request.session;
    const { application } = request.app.locals;
    const { id } = request.params;

    try {
      const post = await getPostData(
        id,
        application.micropubEndpoint,
        access_token
      );

      const micropubUrl = new URL(application.micropubEndpoint);
      micropubUrl.searchParams.append("action", "undelete");
      micropubUrl.searchParams.append("url", post.url);

      /**
       * @todo Third-party Micropub endpoints may require a separate bearer token
       */
      const micropubResponse = await fetch(micropubUrl.href, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${request.session.access_token}`,
        },
      });

      if (!micropubResponse.ok) {
        throw await IndiekitError.fromFetch(micropubResponse);
      }

      const body = await micropubResponse.json();
      const message = encodeURIComponent(body.success_description);

      response.redirect(`${request.baseUrl}?success=${message}`);
    } catch (error) {
      response.status(error.status || 500);
      response.render("undelete-post", {
        title: response.__("posts.undelete.title"),
        back: path.dirname(request.baseUrl + request.path),
        error: error.message,
      });
    }
  },
};