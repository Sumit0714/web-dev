function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel-img skeleton" />
      <div className="skel-body">
        <div className="skel-line skeleton" style={{ width: '55%' }} />
        <div className="skel-line skeleton" style={{ width: '90%' }} />
        <div className="skel-line skeleton" style={{ width: '70%' }} />
        <div className="skel-line skeleton" style={{ width: '40%' }} />
      </div>
    </div>
  );
}

export default SkeletonCard;
