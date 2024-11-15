import React from 'react'
import Div from '../Div'
import AuthorWidget from '../Widget/AuthorWidget'


export default function Sidebar() {
  return (
    <>
      <Div className="cs-sidebar_item">
        <AuthorWidget 
          src=''
          name='Jonathan Wiguna' 
          description='Struggling to finish Milestone 2 of PAWM'
        />
      </Div>

    </>
  )
}
