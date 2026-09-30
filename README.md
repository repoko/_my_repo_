# Image Filter Microservice
A Node.js (Express) service that downloads an image from a public URL, applies a filter (greyscale, resized to 256×256) and returns the result. It's deployed on AWS Elastic Beanstalk.

## Elastic Beanstalk Endpoint
Base URL:
http://image-filter-env.eba-9aqjczv6.us-east-1.elasticbeanstalk.com
Example request:
http://image-filter-env.eba-9aqjczv6.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg

## API
`GET /filteredimage?image_url={{URL}}`
| Status | Meaning |
|---|---|
| 200 | Filtered image returned |
| 400 | `image_url` query parameter is missing |
| 422 | Image could not be downloaded or processed |

## Run Locally
```bash
npm install
npm run dev
```
Then open:
http://localhost:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg

## Deployment (Elastic Beanstalk CLI)
```bash
eb init                      # set up the app: region us-east-1, platform Node.js 24
eb create image-filter-env   # create the environment and deploy the app
eb deploy                    # deploy later code changes (commit first)
```
Useful commands:
```bash
eb status    # environment status and URL
eb health    # instance health
eb logs      # application logs
```

## Deployment Screenshot
See `deployment_screenshot/elastic-beanstalk-dashboard.png` for the environment overview. It shows the health, domain and running version.

## Notes
- The image is fetched with a User-Agent header, because Wikimedia rejects requests that don't send one.
- Elastic Beanstalk is set to ignore 4xx responses, because the app's 400 and 422 errors are intentional.
- The remaining environment "Warning" comes from a Udacity Cloud Lab IAM restriction on the Elastic Beanstalk service role. The application isn't causing it: the instance health is Ok with 100% 2xx responses.