Deployed First App to GCP

## Process
- Package a sample web application into a Docker image.
- Upload the Docker image to Artifact Registry.
- Create a GKE cluster.
- Deploy the sample app to the cluster.
- Manage autoscaling for the deployment.
- Expose the sample app to the internet.
- Deploy a new version of the sample app.

## Step by Step Process
1. Setup
	1. Create new project and switch to new project
	2. add billing account
	3. enable billing for new project
	4. enable artifact registry and kubernetes engine
2. Create a repository
	1. Navigate in the navbar: (Menu -> Home -> Dashboard) then copy Project ID
	2. open Google Cloud Console and click Activate Cloud Shell btn
	3. export PROJECT_ID=< PROJECT_ID >
	4. echo $PROJECT_ID && gcloud config set project $PROJECT_ID
	5. ```gcloud artifacts repositories create hello-repo \
	   --repository-format=docker \
	   --location=us-east1 \
	   --description="Docker repository"```
3. Build container image - I wrote my custom Docker app with Node.js that responds to all requests with Hello World
	1. git clone https://github.com/Borghese-Gladiator/first-docker-gcp
	2. cd first-docker-gcp/
	3. docker build -t us-east1-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v1 .
	4. docker run --rm -p 8080:8080 us-east1-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v1
	5. verify app listens without errors
4. Push Docker image to Artifact Registry
	1. gcloud auth configure-docker us-east1-docker.pkg.dev
	2. docker push us-east1-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v1
5. Create a GKE cluster (Google Kubernetes Engine)
	1. gcloud config set compute/zone us-east1-b
	2. gcloud container clusters create hello-cluster
	3. kubectl get nodes
6. Deploying sample app to GKE
	1. gcloud container clusters get-credentials hello-cluster --zone us-east1-b
	2. kubectl create deployment hello-app --image=us-east1-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v1
	3. kubectl scale deployment hello-app --replicas=3
	4. kubectl autoscale deployment hello-app --cpu-percent=80 --min=1 --max=5
	5. kubectl get pods
7. Exposing app to internet
	1. kubectl expose deployment hello-app --name=hello-app-service --type=LoadBalancer --port 80 --target-port 8080
	2. kubectl get service (wait a few minutes for < pending > ip address)
	3. Copy "EXTERNAL_IP" to the clipboard and paste into
8. Updating app
	1. use vi and update app.js to have version 2.0.0
	2. docker build -t us-east1-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v2 .
	3. docker push us-east1-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v2
	4. kubectl set image deployment/hello-app hello-app=us-east1-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v2

## Notes
- During setup, after enabling APIs, I was prompted to create credentials
	- answered - "accessing Application data"
	- answered - "Yes, I'm using one or more" (GCE, GKE, GAE, GCF)
	- result - You don't need to create new credentials
- During create a GKE cluster, I created a Standard cluster rather than an Autopilot cluster - https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview

## References
https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
- https://cloud.google.com/compute/docs/regions-zones#available
	- regions are collections of zones
	- zones are small deployment areas which need to be set

## Next Steps
- look up rolling update (same as blue green deployment?)
- look up what is VPC native - ```Currently VPC-native is not the default mode during cluster creation. In the future, this will become the default mode and can be disabled using `--no-enable-ip-alias` flag. Use `--[no-]enable-ip-alias` flag to suppress this warning.```
- look up how to specify image type - ```Starting with version 1.19, newly created clusters and node-pools will have COS_CONTAINERD as the default node image when no image type is specified.```
- learn kubernetes through Pluralsight classes & interactive kubernetes online
	- https://kubernetes.io/docs/tutorials/kubernetes-basics/create-cluster/cluster-interactive/


https://console.cloud.google.com/home/dashboard?cloudshell=true&project=first-container-324522&folder=&organizationId=


gcloud artifacts repositories create hello-repo \
   --repository-format=docker \
   --location=us-east1 \
   --description="Docker repository"