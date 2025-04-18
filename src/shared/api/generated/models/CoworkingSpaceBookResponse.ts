/* tslint:disable */
/* eslint-disable */
/**
 * CRM API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface CoworkingSpaceBookResponse
 */
export interface CoworkingSpaceBookResponse {
    /**
     * 
     * @type {string}
     * @memberof CoworkingSpaceBookResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof CoworkingSpaceBookResponse
     */
    location: string;
    /**
     * 
     * @type {string}
     * @memberof CoworkingSpaceBookResponse
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof CoworkingSpaceBookResponse
     */
    time: string;
    /**
     * 
     * @type {string}
     * @memberof CoworkingSpaceBookResponse
     */
    description: string;
}

/**
 * Check if a given object implements the CoworkingSpaceBookResponse interface.
 */
export function instanceOfCoworkingSpaceBookResponse(value: object): value is CoworkingSpaceBookResponse {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('location' in value) || value['location'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('time' in value) || value['time'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    return true;
}

export function CoworkingSpaceBookResponseFromJSON(json: any): CoworkingSpaceBookResponse {
    return CoworkingSpaceBookResponseFromJSONTyped(json, false);
}

export function CoworkingSpaceBookResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CoworkingSpaceBookResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'location': json['location'],
        'title': json['title'],
        'time': json['time'],
        'description': json['description'],
    };
}

export function CoworkingSpaceBookResponseToJSON(json: any): CoworkingSpaceBookResponse {
    return CoworkingSpaceBookResponseToJSONTyped(json, false);
}

export function CoworkingSpaceBookResponseToJSONTyped(value?: CoworkingSpaceBookResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'location': value['location'],
        'title': value['title'],
        'time': value['time'],
        'description': value['description'],
    };
}

