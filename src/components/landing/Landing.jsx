import '../landing/landing.css';

const Landing = () => {
  return (
    <section className="columns is-vcentered">
      <section className="hero is-small">
        <div className="hero-body">
          <h1 className="title is-1">Freight Tech</h1>
        </div>
      </section>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <div className="card">
              <div className="card-content">
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img src="/delivery-man.png" alt="Service 1" />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className="title is-4">Easy Shipments</p>
                  </div>
                </div>
                <div className="content">
                  We provide streamlined shipment processes with minimal hassle and efficient handling.
                </div>
              </div>
            </div>
          </div>
          <div className="column is-one-third">
            <div className="card">
              <div className="card-content">
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img src="/forklift.png" alt="Service 2" />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className="title is-4">Simplified Logistics</p>
                  </div>
                </div>
                <div className="content">
                  Our logistics solutions are designed to make your operations smoother and more predictable.
                </div>
              </div>
            </div>
          </div>
          <div className="column is-one-third">
            <div className="card">
              <div className="card-content">
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img src="/checklist.png" alt="Service 3" />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className="title is-4">Our Responsibilities</p>
                  </div>
                </div>
                <div className="content">
                  We take responsibility for every shipment, ensuring timely and safe delivery.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}

export default Landing;
