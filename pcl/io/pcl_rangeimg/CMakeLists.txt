cmake_minimum_required(VERSION 2.8 FATAL_ERROR) 

set(CMAKE_C_FLAGS "-Wall") 

project(OKPCL) 

if (WIN32) 

set(THREADS_USE_PTHREADS_WIN32 true) 

find_package(Threads REQUIRED) 

include_directories(${THREADS_PTHREADS_INCLUDE_DIR}) 

endif() 

find_package(PCL 1.4 REQUIRED) 

include_directories(. ${PCL_INCLUDE_DIRS}) 

link_directories(${PCL_LIBRARY_DIRS}) 

add_definitions(${PCL_DEFINITIONS}) 

add_executable(OKPCL OKPCL.cpp) 

if(APPLE) 

target_link_libraries(OKPCL freenect ${PCL_LIBRARIES}) 

else() 

find_package(Threads REQUIRED) 

include_directories(${USB_INCLUDE_DIRS})
if (WIN32) 

set(MATH_LIB "") 

else(WIN32) 

set(MATH_LIB "m") 

endif() 

target_link_libraries(OKPCL freenect ${CMAKE_THREAD_LIBS_INIT} ${MATH_LIB} 

${PCL_LIBRARIES}) 

endif()
