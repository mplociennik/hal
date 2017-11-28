<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Conversation
 *
 * @ORM\Table(name="conversation")
 * @ORM\Entity(repositoryClass="Gedmo\Tree\Entity\Repository\NestedTreeRepository")
 */
class Conversation
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

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
	 * @Gedmo\TreeLeft
	 * @ORM\Column(name="lft", type="integer")
	 */
	private $lft;

	/**
	 * @Gedmo\TreeLevel
	 * @ORM\Column(name="lvl", type="integer")
	 */
	private $lvl;

	/**
	 * @Gedmo\TreeRight
	 * @ORM\Column(name="rgt", type="integer")
	 */
	private $rgt;

	/**
	 * @Gedmo\TreeRoot
	 * @ORM\ManyToOne(targetEntity="Category")
	 * @ORM\JoinColumn(name="tree_root", referencedColumnName="id", onDelete="CASCADE")
	 */
	private $root;

	/**
	 * @Gedmo\TreeParent
	 * @ORM\ManyToOne(targetEntity="Category", inversedBy="children")
	 * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="CASCADE")
	 */
	private $parent;

	/**
	 * @ORM\OneToMany(targetEntity="Category", mappedBy="parent")
	 * @ORM\OrderBy({"lft" = "ASC"})
	 */
	private $children;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Conversation
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return Conversation
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

	public function getRoot()
	{
		return $this->root;
	}

	public function setParent(Conversation $parent = null)
	{
		$this->parent = $parent;
	}

	public function getParent() : Conversation
	{
		return $this->parent;
	}
}

