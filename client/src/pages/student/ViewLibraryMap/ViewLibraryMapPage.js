import React from 'react';
import StudentBoilerplate from "../StudentBoilerplate";
import ViewLibraryMap from "../../../components/ViewLibraryMap";

const ViewLibraryMapPage = () => {
    return (
        <div>
            <StudentBoilerplate page={'view_library_map'}/>
            <div className="content">
                <ViewLibraryMap/>
            </div>
        </div>
    );
};

export default ViewLibraryMapPage;