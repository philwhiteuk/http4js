import * as assert from "assert";
import {equal, deepEqual} from "assert";
import {Request} from "../../main/core/Request";
import {Method} from "../../main/core/HttpMessage";
import {httpClient} from "../../main/core/Client";
import {routes} from "../../main/core/RoutingHttpHandler";
import {Response} from "../../main/core/Response";
import {Body} from "../../main/core/Body";

describe("in mem request", () => {

    it("set uri", () => {
        equal(
            new Request(Method.GET, "/")
                .setUri("/tom")
                .uri,
            "/tom")
    });

    it("set body", () => {
        equal(
            new Request(Method.GET, "/")
                .setBody(new Body("body boy"))
                .bodystring(),
            "body boy")
    });

    it("set body string", () => {
        equal(
            new Request(Method.GET, "/")
                .setBodystring("tommy boy")
                .bodystring(),
            "tommy boy")
    });

    it("sets query string", () => {
        equal(
            new Request(Method.GET, "/tom")
                .query("tom", "tosh")
                .query("ben", "bosh")
                .uri,
            "/tom?tom=tosh&ben=bosh")
    });

    it("set header on request", () => {
        equal(
            new Request(Method.GET, "some/url")
                .setHeader("tom", "smells")
                .getHeader("tom"),
            "smells");
    });

    it("concat same header on request", () => {
        assert.deepEqual(
            new Request(Method.GET, "some/url")
                .setHeader("tom", "smells")
                .setHeader("tom", "smells more")
                .setHeader("tom", "smells some more")
                .getHeader("tom"),
            ["smells", "smells more", "smells some more"]);
    });

    it('replace header', () => {
        equal(
            new Request(Method.GET, "some/url")
                .setHeader("tom", "smells")
                .replaceHeader("tom", "is nice")
                .getHeader("tom"),
            "is nice");
    });

    it('remove header', () => {
        equal(
            new Request(Method.GET, "some/url")
                .setHeader("tom", "smells")
                .removeHeader("tom")
                .getHeader("tom"),
            undefined);
    })

});

describe("real request", () => {

    let server = routes("/", (req: Request) => {
        return new Response(new Body("new body")).setHeaders(req.headers);
    }).asServer(3000);


    before(() => {
        server.start();
    });

    it("sets multiple headers of same name", () => {
        let headers = {tom: ["smells", "smells more"]};
        return httpClient().get({host: "localhost", port: 3000, path: "/", headers: headers})
            .then(succ => {
                deepEqual(succ.getHeader("tom"), "smells, smells more")
            })
    });

    after(() => {
        server.stop();
    });

});