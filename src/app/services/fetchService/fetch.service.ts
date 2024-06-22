import { Injectable } from '@angular/core';
import { api_key } from '../../../keys/api.key';

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  constructor() {}

  fetchExercises(
    name?: string | undefined,
    muscle?: string | undefined,
    category?: string | undefined
  ) {
    let path = '?';
    if (name) {
      path += `name=${name}&`;
    }
    if (muscle) {
      path += `muscle=${muscle}&`;
    }
    if (category) {
      path += `type=${category}`;
    }
    return fetch(`https://api.api-ninjas.com/v1/exercises${path}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': api_key,
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const result = await response.json();
        return result;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
