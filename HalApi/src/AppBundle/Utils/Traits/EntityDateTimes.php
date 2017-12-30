<?php

namespace AppBundle\Utils\Traits;

use Doctrine\ORM\Mapping as ORM;

trait EntityDateTimes
{
	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="created_at", type="datetime")
	 */
	private $createdAt;

	/**
	 * @var \DateTime
	 *
	 * @ORM\Column(name="updated_at", type="datetime")
	 */
	private $updatedAt;

	/**
	 * @param \DateTime $createdAt
	 */
	public function setCreatedAt(\DateTime $createdAt)
	{
		$this->createdAt = $createdAt;
	}

	/**
	 * @return \DateTime|string
	 */
	public function getCreatedAt()
	{
		return $this->createdAt->format('Y-m-d H:i:s');
	}

	/**
	 * @param \DateTime $updatedAt
	 */
	public function setUpdatedAt(\DateTime $updatedAt)
	{
		$this->updatedAt = $updatedAt;
	}

	/**
	 * @return \DateTime|string
	 */
	public function getUpdatedAt()
	{
		return $this->updatedAt->format('Y-m-d H:i:s');
	}
}