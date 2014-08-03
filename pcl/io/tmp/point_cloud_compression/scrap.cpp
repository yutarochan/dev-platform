#include <pcl/point_cloud.h>
#include <pcl/point_types.h>
#include <pcl/io/openni_grabber.h>
#include <pcl/visualization/cloud_viewer.h>

#include <pcl/compression/octree_pointcloud_compression.h>

#include <stdio.h>
#include <sstream>
#include <stdlib.h>

// stringstream to store compressed point cloud
std::stringstream compressedData;

// output pointcloud
pcl::PointCloud<pcl::PointXYZRGBA>::Ptr cloudOut (new pcl::PointCloud<pcl::PointXYZRGBA> ());


