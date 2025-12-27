import React from "react";

const MediaTab = ({ data }) => {
    const gallery = data?.media?.gallery || [];
    const videos = data?.media?.videos || [];

    return (
        <div className="row">
            {/* Image Gallery */}
            <div className="col-md-12 mb-4">
                <h6 className="mb-3">Product Images</h6>
                {gallery.length > 0 ? (
                    <div className="row">
                        {gallery.map((image, index) => (
                            <div key={index} className="col-md-3 mb-3">
                                <div className="card">
                                    <img src={image.url} alt={image.alt || 'Product'} className="card-img-top" />
                                    <div className="card-body text-center">
                                        <small>{image.alt || 'No description'}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <i className="fas fa-image me-2"></i>
                        No images available for this product.
                    </div>
                )}
            </div>

            {/* Videos */}
            <div className="col-md-12">
                <h6 className="mb-3">Product Videos</h6>
                {videos.length > 0 ? (
                    <div className="row">
                        {videos.map((video) => (
                            <div key={video.id} className="col-md-4 mb-3">
                                <div className="card">
                                    <img src={video.thumbnail} alt={video.title} className="card-img-top" />
                                    <div className="card-body">
                                        <h6 className="card-title">{video.title}</h6>
                                        <span className="badge bg-primary">{video.type}</span>
                                        <a 
                                            href={video.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-sm btn-outline-primary mt-2 w-100"
                                        >
                                            <i className="fas fa-play me-2"></i>
                                            Watch Video
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <i className="fas fa-video me-2"></i>
                        No videos available for this product.
                    </div>
                )}
            </div>

            <div className="col-md-12 mt-3">
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Note:</strong> To add or manage media, please use the product photo management page.
                </div>
            </div>
        </div>
    );
};

export default MediaTab;
