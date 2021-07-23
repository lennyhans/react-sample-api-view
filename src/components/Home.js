import React, { useEffect, useState } from 'react';

export const Home = () =>{
    const [ marcadas, setMarcadas] = useState(null);
    useEffect( () => {
        fetch('http://localhost:3001/api/propiedadesMarcadas/', { method: 'GET' })
            .then(res => res.json()) // expecting a json response
            .then(json => setMarcadas(json.Items));
    } ,[]);

    const drawRectangle = ({title, width, height, text, classes}) => {
        const defaultWidth = 200;
        const defaultHeight = 200;
        const defaultTitle = "A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera";
        const defaultText = "" + width ?? defaultWidth + "x" + height ?? defaultHeight;
        return(
            <svg className={"bd-placeholder-img " + classes ?? ""}
                width={width ?? defaultWidth} height={height ?? defaultHeight} 
                xmlns="http://www.w3.org/2000/svg" 
                role="img" 
                aria-label={title ?? defaultTitle } 
                preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>{title ?? defaultTitle }</title>
                <rect width="100%" height="100%" fill="#868e96"></rect>
                <text x="50%" y="50%" fill="#dee2e6" dy=".3em">{text ?? defaultText}</text>
            </svg>
        )
    }

    const getPercentageColor = ( percentage ) => {
        console.log(percentage)
        return percentage < 50 ? 
            "bg-danger text-light" :
            percentage < 80 ? 
            "bg-warning text-dark" : "bg-success text-light";
    }

    const getPrintedDate = (dateInt) => {
        const target = new Date(dateInt);
        
        let diff = new Date() - target;
        if(diff < 1000)
            return "Hace un momento";
        diff /= 1000;
        if(diff < 60)
            return "Hace unos segundos";
        diff /= 60;
        if(diff < 60)
            return "Hace unos minutos";
        diff /= 60;
        if(diff < 24)
            return "Hace unas horas";
        diff /= 24;
        if(diff < 7)
            return `Hace ${Math.round(diff)} horas`
        diff /= 7;
        if(diff < 4)
            return `Hace ${Math.round(diff)} semanas`
        
        return target.toLocaleDateString();

    }

    return(
        <div className="container">
            <h1>Detecciones</h1>
            <hr></hr>
            <div className="row">
                <div className="col-4">
                    <div className="list-group" id="list-tab" role="tablist">
                    { marcadas && marcadas.map( (m,i) => (
                        <a className="list-group-item list-group-item-action" 
                            id={"list-" + m.id.N}
                            data-bs-toggle="list" 
                            href={"#list-" + m.id.N + "-detail"} 
                            role="tab" 
                            aria-controls="list-home">
                                <div className="d-flex w-100 justify-content-between">
                                    <span>{drawRectangle({ width: 60, height: 60, classes: "img-thumbnail" })}</span>
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Nombre Propiedad #{m.id.N}</div>
                                        <small>Inmobiliaria #{i+1}</small>
                                        </div>
                                    <span><span className="badge bg-light text-dark rounded-pill ">{m.coincidencia.L.length}</span></span>
                                </div>
                                
                        </a>
                    ))}
                    </div>
                </div>
                <div className="col-8">
                    <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="list-empty-detail" role="tabpanel" aria-labelledby="list-empty">
                        <h2>Aún no hay nada</h2>
                        <p>Seleccione una propiedad para ver las propiedades</p>
                    </div>
                    { marcadas && marcadas.map( (m,i) => (
                        <div className="tab-pane fade" id={"list-" + m.id.N + "-detail"} role="tabpanel" aria-labelledby={"list-" + m.id.N}>
                            <div className="row">
                                <div className="col-5">
                                    {drawRectangle({ width: 250, height: 250 , classes: "mx-auto d-block"})}
                                </div>
                                <div className="col">
                                    <h4>Inmobiliaria #{i+1}</h4>
                                    <label><a href={"#" + m.nombreFoto.S}>{m.nombreFoto.S}</a></label> 
                                    <small title={new Date(+m.hora.N).toLocaleDateString() + " " + new Date(+m.hora.N).toLocaleTimeString()}> {getPrintedDate(+m.hora.N) }</small>
                                    
                                    <ol>
                                    { m.coincidencia.L.map( (t, tindex) => (
                                        <li className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                            <div className="fw-bold">{t.M.texto.S}</div>
                                            {/* <small>Poligono: X, Y | X Y | X Y | X Y</small> */}
                                            </div>
                                            <span className={"badge " + getPercentageColor(Math.round(t.M.confidence.N))}>{Math.round(t.M.confidence.N)} %</span>
                                        </li>
                                    ) )}
                                    </ol>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        {/* <div className="row">
          <div className="col-12">
          <table className="table table-hover table-sm">
            <thead>
                <tr>
                <th scope="col">Id Propiedad</th>
                <th scope="col">Imagen</th>
                <th scope="col"># Textos</th>
                <th scope="col">Handle</th>
                </tr>
            </thead>
            <tbody>
                
                { marcadas && marcadas.map( (m,i) => (
                    <>
                    <tr>
                    <th scope="row">{m.id.N}</th>
                    <td>{m.nombreFoto.S}</td>
                    <td>{m.coincidencia.L.length}</td>
                    <td><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#flush-collapse-" + m.id.N} aria-expanded="false" aria-controls={"#flush-collapse-" + m.id}>
                            View
                        </button>
                    </td>
                    </tr>
                    <tr className="visually-hidden">
                        <td colSpan="4" >
                            <div className="accordion accordion-flush" id={"accordion-" + m.id.N}>
                                <div className="accordion-item">
                                    <div id={"flush-collapse-" + m.id.N} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">
                                        <div className="row">
                                            <div className="col">
                                                <svg className="bd-placeholder-img img-thumbnail" width="200" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera: 200x200" preserveAspectRatio="xMidYMid slice" focusable="false"><title>A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">200x200</text></svg>
                                            </div>
                                            <div className="col">

                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </>
                ))}
            </tbody>
            </table>
          </div>
        </div> */}
      </div>)
}