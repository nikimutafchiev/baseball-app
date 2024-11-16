const lorem = "Nunc laoreet, felis vitae iaculis elementum, mi magna elementum turpis, quis posuere arcu libero eu turpis. Nulla eget porttitor dolor. Sed sagittis massa ut ipsum imperdiet, vitae aliquet sem aliquam. Duis quam ipsum, accumsan at augue nec, blandit vehicula ligula. Etiam vulputate risus eu massa scelerisque vestibulum id ut lacus. Sed ultrices nulla quis convallis luctus. Fusce et dui condimentum, aliquam libero eu, pharetra tellus.Integer et sem at erat laoreet vulputate vitae nec nibh. Aliquam euismod mauris risus, in convallis est tincidunt sed. Duis viverra augue sed sem porta, vitae efficitur tortor dapibus. Donec hendrerit leo ut tincidunt convallis accumsan."

export default function DescriptionSection() {
    return <div className="flex flex-col gap-16 my-8 mx-12">
        <div className='flex flex-row justify-around'>
            <img src="https://placehold.co/400x400" className="rounded"></img>
            <div class="w-1/2 flex flex-col gap-8">
                <h1 class="text-6xl font-semibold">Lorem ipsum to us</h1>
                <p className="text-gray-600 text-pretty text-2xl">{lorem}</p>
            </div>
        </div>
        <div className='flex flex-row justify-around'>
            <div class="w-1/2 flex flex-col gap-8">
                <h1 class="text-6xl font-semibold">Lorem ipsum to us</h1>
                <p className="text-gray-600 text-pretty text-2xl">{lorem}</p>
            </div>
            <img src="https://placehold.co/400x400" className="rounded"></img>
        </div>
        <div className='flex flex-row justify-around'>
            <img src="https://placehold.co/400x400" className="rounded"></img>
            <div class="w-1/2 flex flex-col gap-8">
                <h1 class="text-6xl font-semibold">Lorem ipsum to us</h1>
                <p className="text-gray-600 text-pretty text-2xl">{lorem}</p>
            </div>
        </div>
    </div>
}